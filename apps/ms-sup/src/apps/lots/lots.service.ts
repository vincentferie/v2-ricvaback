import { clean, clean2, roles } from '@app/saas-component/helpers/constants';
import { responseRequest } from '@app/saas-component/helpers/core';
import { TenantDecorateurService } from '@app/saas-component/helpers/decorator';
import { StateLots } from '@app/saas-component/helpers/enums';
import { cleanUp } from '@app/saas-component/helpers/functions';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
import { ReportWarnModel } from '@app/saas-component/helpers/model';
import { MainComponentService } from '@app/saas-component/settings/main-component/main-component.service';
import { Inject, Injectable } from '@nestjs/common';
import { isDefined, UUIDVersion } from 'class-validator';
import { Connection, ILike, IsNull, Not, Raw, Repository } from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { ReportWarnEntity } from '../externe/report.entity';
import { UnloadingEntity } from '../unloading/unloading.entity';
import { AnalysesEntity } from './analyse/analyse.entity';
import { AnalysesModel } from './analyse/analyse.model';
import { BalanceEntity } from './balance/balance.entity';
import { BalanceModel } from './balance/balance.model';
import { CessionEntity } from './cession/cession.entity';
import { CessionModel } from './cession/cession.model';
import { FileTicketEntity } from './file/file-ticket-pesee.entity';
import { FileTicketModel } from './file/file-ticket-pesee.model';
import { LotEntity } from './lot.entity';
import { LotModel } from './lot.model';
import { SweepEntity } from './sweep/sweep.entity';
import { SweepModel } from './sweep/sweep.model';
import { TransfertEntity } from './transfert/transfert.entity';
import { TransfertModel } from './transfert/transfert.model';

@Injectable()
@TenantDecorateurService()
export class LotsService {
  private repository: Repository<LotEntity>;
  private subRepository: Repository<FileTicketEntity>;
  private reportRepository: Repository<ReportWarnEntity>;
  private unloadRepository: Repository<UnloadingEntity>;
  private analyseRepository: Repository<AnalysesEntity>;
  private balanceRepository: Repository<BalanceEntity>;
  private cessionRepository: Repository<CessionEntity>;
  private sweepRepository: Repository<SweepEntity>;
  private transfertRepository: Repository<TransfertEntity>;

  private connectionOk = true;
  private relationship = [
    'file',
    'campagne',
    'superviseur',
    'dechargement',
    'analyses',
    'balayures',
    'transferts',
    'balances',
    'cession',
  ];

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
    private readonly mainComponent: MainComponentService,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.unloadRepository = connection.getRepository(UnloadingEntity);
      this.repository = connection.getRepository(LotEntity);
      this.subRepository = connection.getRepository(FileTicketEntity);
      this.analyseRepository = connection.getRepository(AnalysesEntity);
      this.balanceRepository = connection.getRepository(BalanceEntity);
      this.cessionRepository = connection.getRepository(CessionEntity);
      this.sweepRepository = connection.getRepository(SweepEntity);
      this.transfertRepository = connection.getRepository(TransfertEntity);
      this.reportRepository = connection.getRepository(ReportWarnEntity);
    }
  }

  async save(input: IRmqInput<LotModel>): Promise<any> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const unload = await this.unloadRepository.findOne({
            relations: ['entrepot', 'exportateur', 'campagne'],
            where: { id: input.value.dechargement_id },
            withDeleted: false,
          });
          if (!isDefined(unload)) {
            return responseRequest({
              status: 'errorFound',
              data: null,
              params: `Aucun element ne correspont au paramètre id ${input.value.dechargement_id}`,
            });
          }

          const mainRelation: any = await this.getMainObject(
            unload.provenance_id,
            unload.speculation_id,
          );

          const resultLot: any = await this.repository
            .createQueryBuilder('lot')
            .select('COUNT(lot.id)', 'nbreLot')
            .where(
              'lot.date_dechargement BETWEEN :deb::timestamp AND :fin::timestamp',
              {
                deb: this.convertIsoDate(unload.campagne.ouverture),
                fin: this.convertIsoDate(unload.campagne.fermeture),
              },
            )
            .getRawOne();

          const unicity = await this.genUnicity(
            { ...unload, ...mainRelation },
            resultLot.nbreLot,
          );
          const final: LotModel = {
            ...input.value,
            ...{
              campagne_id: unload.campagne_id,
              superviseur_id: input.user.id,
              site_id: unload.entrepot.site_id,
              entrepot_id: unload.entrepot_id,
              exportateur_id: unload.exportateur_id,
              speculation_id: unload.speculation_id,
              specificity_id: unload.specificity_id,
              code_dechargement: unicity,
              created_by: input.user.name,
            },
          };
          result = await this.repository.save(final);

          if (isDefined(result)) {
            // Save file in DB table
            if (isDefined(input.file)) {
              const file = {
                ...({
                  lot_id: result.id,
                  filename: input.file.filename ?? input.file.key,
                  path: input.file.path ?? input.file.url,
                  aws_id: input.file.aws_id ?? null,
                } as FileTicketModel),
                created_by: input.user.name,
              };
              result.file = await this.subRepository.save(file);
            }
          }
          exception = await responseRequest({
            status: 'inserted',
            data: result,
            params: {},
          });
        } catch (error) {
          if (error.code === '23505') {
            // Duplucate
            exception = await responseRequest({
              status: 'errorInserted',
              data: error,
              params: error.detail,
            });
          } else if (error.code === '22001') {
            exception = await responseRequest({
              status: 'errorPayload',
              data: error,
              params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: error.message,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async update(input: IRmqInput<LotModel>): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.repository.findOne(
          { id: input.param },
          { where: { validity: false }, withDeleted: false },
        );
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: null,
            params: `Aucun element ne correspont au paramètre id ${input.param} est autorisé à être mis à jour.`,
          });
        }
        try {
          response.updated_by = input.user.name;
          result = await this.repository.update(
            { id: input.param },
            { ...response, ...input.value },
          );

          exception = await responseRequest({
            status: 'updated',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorUpdated',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }

    return exception;
  }

  async delete(input: IRmqInput<LotModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.repository.findOne(
          { id: input.param },
          { where: { validity: false }, withDeleted: false },
        );
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param} est autorisé à être supprimé.`,
          });
        }
        try {
          result = await this.repository.delete(input.param);

          if (isDefined(result)) {
            // Delete File
            const query = await this.subRepository.findOne({
              lot_id: input.param,
            });
            if (isDefined(query)) {
              await this.subRepository.delete({ lot_id: input.param });
              result.fileForDeleted = {
                filename: query.filename,
                path: query.path,
                aws_id: query.aws_id,
              }; // delete origin file
            }
          }

          exception = await responseRequest({
            status: 'deleted',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorDeleted',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async softDelete(input: IRmqInput<LotModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.repository.findOne(
          { id: input.param },
          { where: { validity: false }, withDeleted: false },
        );
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param} est autorisé à être mis à jour.`,
          });
        }
        try {
          response.deleted_by = input.user.name;
          await this.repository.update({ id: input.param }, response);
          result = await this.repository.softDelete({ id: input.param });

          exception = await responseRequest({
            status: 'deleted',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorDeleted',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async restore(input: IRmqInput<LotModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.repository.findOne(input.param, {
          withDeleted: true,
          where: { deleted_date: Not(IsNull()) },
        });
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          response.updated_by = input.user.name;
          await this.repository.update({ id: input.param }, response);
          result = await this.repository.restore({ id: input.param });

          exception = await responseRequest({
            status: 'updated',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorUpdated',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }

    return exception;
  }

  async findAll(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const filtering = roles.filter(
            (val) =>
              val.id === input.user.role &&
              input.user.role === '821c83c6-d9e2-46ec-89b5-8fc1483a31f1',
          ); // Find the authorized role

          const found = await this.repository.find({
            relations: this.relationship,
            withDeleted: false,
            where: filtering
              ? {
                  superviseur_id: input.user.id,
                  campagne_id: input.value.filter_id,
                }
              : { campagne_id: input.value.filter_id },
          });

          if (isDefined(found)) {
            for (const item of found) {
              const mainRelation = await this.getMainObject(
                item.dechargement.provenance_id,
                item.speculation_id,
              );
              const finalItem = cleanUp(item, clean);
              const analyses = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean)
                : null;
              const balances = isDefined(item.balances)
                ? item.balances.map((val) =>
                    isDefined(val) ? cleanUp(val, clean) : null,
                  )
                : null;
              const balayures = isDefined(item.balayures)
                ? item.balayures.map((val) =>
                    isDefined(val) ? cleanUp(val, clean) : null,
                  )
                : null;
              const cessions = isDefined(item.cession)
                ? cleanUp(item.cession, clean)
                : null;

              const supervisor = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;
              const file = isDefined(item.file)
                ? cleanUp(item.file, clean)
                : null;
              const dechargement = isDefined(item.dechargement)
                ? cleanUp(item.dechargement, clean)
                : null;
              const dechFile = isDefined(item.dechargement.file)
                ? cleanUp(item.dechargement.file, clean)
                : null;
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;
              result.push({
                ...finalItem,
                ...mainRelation,
                campagne: campagne,
                dechargement: { ...dechargement, file: dechFile },
                superviseur: supervisor,
                analyses: analyses,
                balances: balances,
                balayures: balayures,
                cession: cessions,
                file: file,
              });
            }
          }
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    await this.connection.close();
    return exception;
  }

  async findPaginate(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const filtering = roles.filter(
            (val) =>
              val.id === input.user.role &&
              input.user.role === '821c83c6-d9e2-46ec-89b5-8fc1483a31f1',
          ); // Find the authorized role

          const [found, total] = await this.repository.findAndCount({
            relations: this.relationship,
            withDeleted: false,
            where: filtering
              ? {
                  superviseur_id: input.user.id,
                  campagne_id: input.value.filter_id,
                }
              : { campagne_id: input.value.filter_id },
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });
          if (isDefined(found)) {
            for (const item of found) {
              const mainRelation = await this.getMainObject(
                item.dechargement.provenance_id,
                item.speculation_id,
              );
              const finalItem = cleanUp(item, clean);
              const analyses = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean)
                : null;
              const balances = isDefined(item.balances)
                ? item.balances.map((val) =>
                    isDefined(val) ? cleanUp(val, clean) : null,
                  )
                : null;
              const balayures = isDefined(item.balayures)
                ? item.balayures.map((val) =>
                    isDefined(val) ? cleanUp(val, clean) : null,
                  )
                : null;
              const cessions = isDefined(item.cession)
                ? cleanUp(item.cession, clean)
                : null;

              const supervisor = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;
              const file = isDefined(item.file)
                ? cleanUp(item.file, clean)
                : null;
              const dechargement = isDefined(item.dechargement)
                ? cleanUp(item.dechargement, clean)
                : null;
              const dechFile = isDefined(item.dechargement.file)
                ? cleanUp(item.dechargement.file, clean)
                : null;
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;
              result.push({
                ...finalItem,
                ...mainRelation,
                campagne: campagne,
                dechargement: { ...dechargement, file: dechFile },
                superviseur: supervisor,
                analyses: analyses,
                balances: balances,
                balayures: balayures,
                cession: cessions,
                file: file,
              });
            }
          }
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });

          // Set Meta Pagination information
          exception[0].response.meta = {
            itemCount: total,
            totalItems: total,
            itemsPerPage: +input.value.take,
            totalPages: Math.floor(total / +input.value.take),
            currentPage: +input.value.offset + 1,
          };
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findPaginateResearch(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const filtering = roles.filter(
            (val) =>
              val.id === input.user.role &&
              input.user.role === '821c83c6-d9e2-46ec-89b5-8fc1483a31f1',
          ); // Find the authorized role

          const [found, total] = await this.repository.findAndCount({
            relations: this.relationship,
            withDeleted: false,
            where: filtering
              ? [
                  {
                    campagne_id: input.value.filter_id,
                    superviseur_id: input.user.id,
                    num_fiche: Raw(
                      (columnAlias) =>
                        `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                      { value: `%${input.value.query}%` },
                    ),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    superviseur_id: input.user.id,
                    date_chargement: Raw(
                      (columnAlias) =>
                        `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`,
                      { value: `%${input.value.query}%` },
                    ),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    superviseur_id: input.user.id,
                    tracteur: ILike(`%${input.value.query}%`),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    superviseur_id: input.user.id,
                    remorque: ILike(`%${input.value.query}%`),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    superviseur_id: input.user.id,
                    fournisseur: ILike(`%${input.value.query}%`),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    superviseur_id: input.user.id,
                    contact_fournisseur: Raw(
                      (columnAlias) =>
                        ` CAST(${columnAlias} AS TEXT) ILIKE :value`,
                      { value: `%${input.value.query}%` },
                    ),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    superviseur_id: input.user.id,
                    transporteur: ILike(`%${input.value.query}%`),
                  },
                ]
              : [
                  {
                    campagne_id: input.value.filter_id,
                    num_fiche: Raw(
                      (columnAlias) =>
                        `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                      { value: `%${input.value.query}%` },
                    ),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    date_chargement: Raw(
                      (columnAlias) =>
                        `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`,
                      { value: `%${input.value.query}%` },
                    ),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    tracteur: ILike(`%${input.value.query}%`),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    remorque: ILike(`%${input.value.query}%`),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    fournisseur: ILike(`%${input.value.query}%`),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    contact_fournisseur: Raw(
                      (columnAlias) =>
                        ` CAST(${columnAlias} AS TEXT) ILIKE :value`,
                      { value: `%${input.value.query}%` },
                    ),
                  },
                  {
                    campagne_id: input.value.filter_id,
                    transporteur: ILike(`%${input.value.query}%`),
                  },
                ],
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const mainRelation = await this.getMainObject(
                item.dechargement.provenance_id,
                item.speculation_id,
              );
              const finalItem = cleanUp(item, clean);
              const analyses = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean)
                : null;
              const balances = isDefined(item.balances)
                ? item.balances.map((val) =>
                    isDefined(val) ? cleanUp(val, clean) : null,
                  )
                : null;
              const balayures = isDefined(item.balayures)
                ? item.balayures.map((val) =>
                    isDefined(val) ? cleanUp(val, clean) : null,
                  )
                : null;
              const cessions = isDefined(item.cession)
                ? cleanUp(item.cession, clean)
                : null;

              const supervisor = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;
              const file = isDefined(item.file)
                ? cleanUp(item.file, clean)
                : null;
              const dechargement = isDefined(item.dechargement)
                ? cleanUp(item.dechargement, clean)
                : null;
              const dechFile = isDefined(item.dechargement.file)
                ? cleanUp(item.dechargement.file, clean)
                : null;
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;
              result.push({
                ...finalItem,
                ...mainRelation,
                campagne: campagne,
                dechargement: { ...dechargement, file: dechFile },
                superviseur: supervisor,
                analyses: analyses,
                balances: balances,
                balayures: balayures,
                cession: cessions,
                file: file,
              });
            }
          }
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });

          // Set Meta Pagination information
          exception[0].response.meta = {
            itemCount: total,
            totalItems: total,
            itemsPerPage: +input.value.take,
            totalPages: Math.floor(total / +input.value.take),
            currentPage: +input.value.offset + 1,
          };
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findDeleted(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const filtering = roles.filter(
            (val) =>
              val.id === input.user.role &&
              input.user.role === '821c83c6-d9e2-46ec-89b5-8fc1483a31f1',
          ); // Find the authorized role

          const [found, total] = await this.repository.findAndCount({
            relations: this.relationship,
            withDeleted: true,
            where: filtering
              ? {
                  superviseur_id: input.user.id,
                  campagne_id: input.value.filter_id,
                }
              : { campagne_id: input.value.filter_id },
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const mainRelation = await this.getMainObject(
                item.dechargement.provenance_id,
                item.speculation_id,
              );
              const finalItem = cleanUp(item, clean);
              const analyses = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean)
                : null;
              const balances = isDefined(item.balances)
                ? item.balances.map((val) =>
                    isDefined(val) ? cleanUp(val, clean) : null,
                  )
                : null;
              const balayures = isDefined(item.balayures)
                ? item.balayures.map((val) =>
                    isDefined(val) ? cleanUp(val, clean) : null,
                  )
                : null;
              const cessions = isDefined(item.cession)
                ? cleanUp(item.cession, clean)
                : null;

              const supervisor = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;
              const file = isDefined(item.file)
                ? cleanUp(item.file, clean)
                : null;
              const dechargement = isDefined(item.dechargement)
                ? cleanUp(item.dechargement, clean)
                : null;
              const dechFile = isDefined(item.dechargement.file)
                ? cleanUp(item.dechargement.file, clean)
                : null;
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;
              result.push({
                ...finalItem,
                ...mainRelation,
                campagne: campagne,
                dechargement: { ...dechargement, file: dechFile },
                superviseur: supervisor,
                analyses: analyses,
                balances: balances,
                balayures: balayures,
                cession: cessions,
                file: file,
              });
            }
          }
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });

          // Set Meta Pagination information
          exception[0].response.meta = {
            itemCount: total,
            totalItems: total,
            itemsPerPage: +input.value.take,
            totalPages: Math.floor(total / +input.value.take),
            currentPage: +input.value.offset + 1,
          };
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findById(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const filtering = roles.filter(
            (val) =>
              val.id === input.user.role &&
              input.user.role === '821c83c6-d9e2-46ec-89b5-8fc1483a31f1',
          ); // Find the authorized role

          const found = await this.repository.findOne({
            relations: this.relationship,
            withDeleted: false,
            where: filtering
              ? {
                  superviseur_id: input.user.id,
                  id: input.param,
                  campagne_id: input.value.filter_id,
                }
              : { id: input.param, campagne_id: input.value.filter_id },
          });

          if (isDefined(found)) {
            const mainRelation = await this.getMainObject(
              found.dechargement.provenance_id,
              found.speculation_id,
            );
            const finalItem = cleanUp(found, clean);
            const analyses = isDefined(found.analyses)
              ? cleanUp(found.analyses, clean)
              : null;
            const balances = isDefined(found.balances)
              ? found.balances.map((val) =>
                  isDefined(val) ? cleanUp(val, clean) : null,
                )
              : null;
            const balayures = isDefined(found.balayures)
              ? found.balayures.map((val) =>
                  isDefined(val) ? cleanUp(val, clean) : null,
                )
              : null;
            const cessions = isDefined(found.cession)
              ? cleanUp(found.cession, clean)
              : null;

            const supervisor = isDefined(found.superviseur)
              ? cleanUp(found.superviseur, clean2)
              : null;
            const file = isDefined(found.file)
              ? cleanUp(found.file, clean)
              : null;
            const dechargement = isDefined(found.dechargement)
              ? cleanUp(found.dechargement, clean)
              : null;
            const dechFile = isDefined(found.dechargement.file)
              ? cleanUp(found.dechargement.file, clean)
              : null;
            const campagne = isDefined(found.campagne)
              ? cleanUp(found.campagne, clean)
              : null;

            result = {
              ...finalItem,
              ...mainRelation,
              campagne: campagne,
              dechargement: { ...dechargement, file: dechFile },
              superviseur: supervisor,
              analyses: analyses,
              balances: balances,
              balayures: balayures,
              cession: cessions,
              file: file,
            };
          }
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: Object.keys(result || {}).length,
          });
        } catch (error) {
          console.log(error);
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.param)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findCompletion(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const filtering = roles.filter(
            (val) =>
              val.id === input.user.role &&
              input.user.role === '821c83c6-d9e2-46ec-89b5-8fc1483a31f1',
          ); // Find the authorized role

          const [found, total] = await this.repository.findAndCount({
            select: ['id', 'numero_lot', 'numero_ticket_pese'],
            withDeleted: false,
            where: filtering
              ? {
                  campagne_id: input.value.filter_id,
                  superviseur_id: input.user.id,
                  numero_ticket_pese: Raw(
                    (columnAlias) =>
                      `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                    { value: `%${input.value.query}%` },
                  ),
                }
              : {
                  campagne_id: input.value.filter_id,
                  numero_ticket_pese: Raw(
                    (columnAlias) =>
                      `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                    { value: `%${input.value.query}%` },
                  ),
                },
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            result = cleanUp(found, clean);
          }
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });

          // Set Meta Pagination information
          exception[0].response.meta = {
            itemCount: total,
            totalItems: total,
            itemsPerPage: +input.value.take,
            totalPages: Math.floor(total / +input.value.take),
            currentPage: +input.value.offset + 1,
          };
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findNoPledge(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const found = await this.repository
            .createQueryBuilder('lots')
            .select(['id', 'numero_lot', 'numero_ticket_pese'])
            .innerJoin('lots.analyses', 'analyse', 'lots.id = analyse.lot_id')
            .leftJoin('lots_nantis', 'nantis', 'lots.id = nantis.lot_id')
            .where('nantis.lot_id IS NULL')
            .andWhere('lots.validity = :validity::boolean', { validity: true })
            .andWhere('lots.statut = :state::cashew.lot_statut_enum', {
              state: StateLots.nantis,
            })
            .withDeleted()
            .getMany();

          // result = await this.repository.find({
          //   select: ['id', 'numero_lot', 'numero_ticket_pese'],
          //   join: {
          //     alias: 'lots',
          //     leftJoin: {
          //       analyses: 'lots.analyses',
          //       lotsNantis: 'lots.lotsNantis',
          //     },
          //   },
          //   where: {
          //     entrepot_id: input.param,
          //     lotsNantis: {
          //       lot_id: IsNull(),
          //     },
          //     validity: true,
          //   },
          //   withDeleted: false,
          // });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const analyse = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean)
                : null;
              result.push({
                ...finalItem,
                analyses: analyse,
              });
            }
          }

          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findNoStuffing(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any;
    const result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          // const isNullLotEmpote = await this.repository.find({
          //   select: ['id', 'numero_lot', 'numero_ticket_pese'],
          //   join: {
          //     alias: 'lots',
          //     leftJoinAndSelect: {
          //       analyses: 'lots.analyses',
          //     },
          //     leftJoin: {
          //       lotPlanEmpotage: 'lots.lotPlanEmpotage',
          //     },
          //   },
          //   where: [
          //     {
          //       entrepot_id: input.param,
          //       lotPlanEmpotage: {
          //         lot_id: IsNull(),
          //       },
          //       statut: IsNull(),
          //       validity: true,
          //     },
          //     {
          //       entrepot_id: input.param,
          //       lotPlanEmpotage: {
          //         lot_id: IsNull(),
          //       },
          //       statut: StateLots.relacher,
          //       validity: true,
          //     },
          //   ],
          //   withDeleted: false,
          // });

          const isNullLotEmpote = await this.repository
            .createQueryBuilder('lots')
            .select([
              'lots.id',
              'lots.numero_lot',
              'lots.numero_ticket_pese',
              'lots.sac_en_stock',
            ])
            .innerJoinAndSelect(
              'lots.analyses',
              'analyses',
              'lots.id = analyses.lot_id',
            )
            .leftJoin('plan_empotage_lots', 'empote', 'lots.id = empote.lot_id')
            .where('empote.lot_id IS NULL')
            .andWhere('lots.entrepot_id = :entrepot::uuid', {
              entrepot: input.param,
            })
            // .andWhere('lots.superviseur_id = :id::uuid', { id: input.user.id })
            .andWhere('lots.validity = :validity::boolean', { validity: true })
            .andWhere('lots.statut IS NULL')
            .orWhere('lots.statut = :state::cashew.lot_statut_enum', {
              state: StateLots.relacher,
            })
            .withDeleted()
            .getMany();

          const isNotNullLotEmpote = await this.repository
            .createQueryBuilder('lots')
            .select([
              'lots.id',
              'lots.numero_lot',
              'lots.numero_ticket_pese',
              'lots.sac_en_stock',
            ])
            .addSelect(
              'lots.sac_en_stock - SUM(empote.nbr_sacs)',
              'sac_restant',
            )
            .innerJoinAndSelect(
              'lots.analyses',
              'analyses',
              'lots.id = analyses.lot_id',
            )
            .innerJoinAndSelect(
              'plan_empotage_lots',
              'empote',
              'lots.id = empote.lot_id',
            )
            // .where('lots.superviseur_id = :user::uuid', { user: input.user.id })
            .where('lots.validity = :validity::boolean', { validity: true })
            .andWhere('lots.entrepot_id = :entrepot::uuid', {
              entrepot: input.param,
            })
            .andWhere('lots.statut IS NULL')
            .orWhere('lots.statut = :state::cashew.lot_statut_enum', {
              state: StateLots.relacher,
            })
            // .groupBy('lots.sac_en_stock')
            // .addGroupBy('lots.id')
            .groupBy('lots.id')
            .addGroupBy('analyses.id')
            .addGroupBy('empote.id')
            .having('(lots.sac_en_stock - SUM(empote.nbr_sacs)) > 0')
            .withDeleted()
            .andWhere('lots.deleted_date IS NOT NULL')
            .getMany();

          const found = isNullLotEmpote.concat(isNotNullLotEmpote);
          //result = isNullLotEmpote;
          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const sacRestant = isDefined(finalItem.sac_restant)
                ? finalItem.sac_restant
                : 0;
              const analyse = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean)
                : null;

              result.push({
                ...finalItem,
                sac_restant: sacRestant,
                analyses: analyse,
              });
            }
          }

          exception = await responseRequest({
            status: 'foundQuery',
            data: result,
            params: result.length,
          });
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findNoAnalysis(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const filtering = roles.filter(
            (val) =>
              val.id === input.user.role &&
              input.user.role === '821c83c6-d9e2-46ec-89b5-8fc1483a31f1',
          ); // Find the authorized role

          // result = await this.entityRepository
          //                     .createQueryBuilder("lots")
          //                     .leftJoin("admin_analyse", "lotAnalyse", "lots.id = lotAnalyse.lot_id")
          //                     .where("lotAnalyse.lot_id IS NULL")
          //                     .andWhere("lots.validity = :validity::boolean", {validity: true})
          //                     .andWhere("lots.superviseur_id = :user::uuid", {user: payload.user.id})
          //                     .andWhere("lots.mode = :mode",{mode : SoftDelete.active})
          //                     .getMany();

          const found = await this.repository.find({
            select: ['id', 'numero_lot', 'numero_ticket_pese'],
            join: {
              alias: 'lots',
              leftJoin: {
                analyses: 'lots.analyses',
              },
            },
            where: filtering
              ? {
                  entrepot_id: input.param,
                  analyses: {
                    lot_id: IsNull(),
                  },
                  // validity: true,
                  superviseur_id: input.user.id,
                }
              : {
                  entrepot_id: input.param,
                  analyses: {
                    lot_id: IsNull(),
                  },
                  // validity: true,
                },
            withDeleted: false,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const analyse = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean)
                : null;
              result.push({
                ...finalItem,
                analyses: analyse,
              });
            }
          }

          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findNoTransfert(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const filtering = roles.filter(
            (val) =>
              val.id === input.user.role &&
              input.user.role === '821c83c6-d9e2-46ec-89b5-8fc1483a31f1',
          ); // Find the authorized role

          const found = await this.repository.find({
            select: ['id', 'numero_ticket_pese', 'numero_lot'],
            join: {
              alias: 'lots',
              leftJoin: {
                transferts: 'lots.transferts',
              },
            },
            where: filtering
              ? {
                  entrepot_id: input.param,
                  transferts: {
                    lot_id: IsNull(),
                  },
                  validity: true,
                  superviseur_id: input.user.id,
                }
              : {
                  entrepot_id: input.param,
                  transferts: {
                    lot_id: IsNull(),
                  },
                  validity: true,
                },
            withDeleted: false,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const transferts = isDefined(item.transferts)
                ? cleanUp(item.transferts, clean)
                : null;
              result.push({
                ...finalItem,
                transferts: transferts,
              });
            }
          }

          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findNoCession(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const filtering = roles.filter(
            (val) =>
              val.id === input.user.role &&
              input.user.role === '821c83c6-d9e2-46ec-89b5-8fc1483a31f1',
          ); // Find the authorized role

          const found = await this.repository.find({
            select: ['id', 'numero_ticket_pese', 'numero_lot'],
            join: {
              alias: 'lots',
              leftJoin: {
                cession: 'lots.cession',
              },
            },
            where: filtering
              ? {
                  entrepot_id: input.param,
                  cession: {
                    lot_id: IsNull(),
                  },
                  validity: true,
                  superviseur_id: input.user.id,
                }
              : {
                  entrepot_id: input.param,
                  cession: {
                    lot_id: IsNull(),
                  },
                  validity: true,
                },
            withDeleted: false,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const cession = isDefined(item.cession)
                ? cleanUp(item.cession, clean)
                : null;
              result.push({
                ...finalItem,
                cession: cession,
              });
            }
          }
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findPottingPlan(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const found = await this.repository
            .createQueryBuilder('lots')
            .select([
              'id',
              'numero_lot',
              'numero_ticket_pese',
              'nbr_sacs',
              'sac_en_stock',
            ])
            .leftJoinAndSelect(
              'lots.analyses',
              'analyses',
              'lots.id = analyses.lot_id',
            )
            .leftJoinAndSelect(
              'plan_empotage_lots',
              'empote',
              'lots.id = empote.lot_id',
            )
            .leftJoin(
              'detail_execution_empotage',
              'execLot',
              'lots.id = execLot.lot_id',
            )
            .where('execLot.lot_id IS NULL')
            .andWhere('lots.validity = :validity::boolean', { validity: true })
            .andWhere('empote.plan_empotage_id = :id::uuid', {
              id: input.param,
            })
            .orWhere('lots.entrepot_id = :id::uuid', {
              id: input.value.filter_id,
            })
            .orWhere('lots.entrepot_id = :id::uuid', {
              id: input.value.filter_three_id,
            })
            .orWhere('lots.entrepot_id = :id::uuid', {
              id: input.value.filter_three_id,
            })
            .orWhere('lots.entrepot_id = :id::uuid', {
              id: input.value.filter_four_id,
            })
            .withDeleted()
            .getMany();

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const lotPlanEmpotage = isDefined(item.lotPlanEmpotage)
                ? cleanUp(item.lotPlanEmpotage, clean)
                : null;
              const analyses = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean)
                : null;

              result.push({
                ...finalItem,
                sac_restant: 0,
                lotPlanEmpotage: lotPlanEmpotage,
                analyses: analyses,
              });
            }
          }

          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async findExecution(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          // const found = await this.repository.find({
          //   select: ['id', 'numero_lot', 'numero_ticket_pese'],
          //   join: {
          //     alias: 'lots',
          //     // leftJoin: {
          //     //   lotPlanEmpotage: 'lots.lotPlanEmpotage',
          //     // },
          //     leftJoinAndSelect: {
          //       analyses: 'lots.analyses',
          //       lotPlanEmpotage: 'lots.lotPlanEmpotage',
          //     },
          //   },
          //   where: [
          //     {
          //       lotPlanEmpotage: {
          //         plan_empotage_id: input.param,
          //       },
          //       entrepot_id: input.value.filter_id,
          //       validity: true,
          //     },
          //     {
          //       lotPlanEmpotage: {
          //         plan_empotage_id: input.param,
          //       },
          //       entrepot_id: input.value.filter_two_id,
          //       validity: true,
          //     },
          //     {
          //       lotPlanEmpotage: {
          //         plan_empotage_id: input.param,
          //       },
          //       entrepot_id: input.value.filter_three_id,
          //       validity: true,
          //     },
          //     {
          //       lotPlanEmpotage: {
          //         plan_empotage_id: input.param,
          //       },
          //       entrepot_id: input.value.filter_four_id,
          //       validity: true,
          //     },
          //   ],
          //   withDeleted: false,
          // });

          const found = await this.repository
            .createQueryBuilder('lots')
            .select([
              'id',
              'numero_lot',
              'numero_ticket_pese',
              'nbr_sacs',
              'sac_en_stock',
            ])
            .leftJoinAndSelect(
              'lots.analyses',
              'analyses',
              'lots.id = analyses.lot_id',
            )
            .leftJoinAndSelect(
              'plan_empotage_lots',
              'empote',
              'lots.id = empote.lot_id',
            )
            .where('analyses.lot_id IS NULL')
            .andWhere('lots.validity = :validity::boolean', { validity: true })
            .andWhere('empote.plan_empotage_id = :id::uuid', {
              id: input.param,
            })
            .orWhere('lots.entrepot_id = :id::uuid', {
              id: input.value.filter_id,
            })
            .orWhere('lots.entrepot_id = :id::uuid', {
              id: input.value.filter_three_id,
            })
            .orWhere('lots.entrepot_id = :id::uuid', {
              id: input.value.filter_three_id,
            })
            .orWhere('lots.entrepot_id = :id::uuid', {
              id: input.value.filter_four_id,
            })
            .withDeleted()
            .getMany();

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const lotPlanEmpotage = isDefined(item.lotPlanEmpotage)
                ? cleanUp(item.lotPlanEmpotage, clean)
                : null;
              const analyses = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean)
                : null;

              result.push({
                ...finalItem,
                lotPlanEmpotage: lotPlanEmpotage,
                analyses: analyses,
              });
            }
          }

          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length,
          });
        } catch (error) {
          if (error.code === '22P02') {
            exception = await responseRequest({
              status: 'errorFound',
              data: result,
              params: error.message,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async report(input: IRmqInput<ReportWarnModel>): Promise<any> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const valueToSave = {
            ...input.value,
            created_by: input.user.name,
          };
          result = await this.reportRepository.save(valueToSave);

          exception = await responseRequest({
            status: 'inserted',
            data: result,
            params: {},
          });
        } catch (error) {
          if (error.code === '23505') {
            // Duplucate
            exception = await responseRequest({
              status: 'errorInserted',
              data: error,
              params: error.detail,
            });
          } else if (error.code === '22001') {
            exception = await responseRequest({
              status: 'errorPayload',
              data: error,
              params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: error.message,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  // Analse
  async saveAnalize(input: IRmqInput<AnalysesModel>): Promise<any> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const valueToSave = {
            ...input.value,
            created_by: input.user.name,
          };
          result = await this.analyseRepository.save(valueToSave);
          exception = await responseRequest({
            status: 'inserted',
            data: result,
            params: {},
          });
        } catch (error) {
          if (error.code === '23505') {
            // Duplucate
            exception = await responseRequest({
              status: 'errorInserted',
              data: error,
              params: error.detail,
            });
          } else if (error.code === '22001') {
            exception = await responseRequest({
              status: 'errorPayload',
              data: error,
              params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: error.message,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async updateAnalize(input: IRmqInput<AnalysesModel>): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.analyseRepository.findOne(
          { id: input.param },
          { withDeleted: false },
        );
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: null,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          response.updated_by = input.user.name;
          result = await this.analyseRepository.update(
            { id: input.param },
            { ...response, ...input.value },
          );

          exception = await responseRequest({
            status: 'updated',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorUpdated',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }

    return exception;
  }

  async deleteAnalize(input: IRmqInput<AnalysesModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.analyseRepository.findOne({
          id: input.param,
        });
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          result = await this.analyseRepository.delete(input.param);
          exception = await responseRequest({
            status: 'deleted',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorDeleted',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  // Transfert
  async saveTransfert(input: IRmqInput<TransfertModel>): Promise<any> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const valueToSave = {
            ...input.value,
            created_by: input.user.name,
          };
          result = await this.transfertRepository.save(valueToSave);
          exception = await responseRequest({
            status: 'inserted',
            data: result,
            params: {},
          });
        } catch (error) {
          if (error.code === '23505') {
            // Duplucate
            exception = await responseRequest({
              status: 'errorInserted',
              data: error,
              params: error.detail,
            });
          } else if (error.code === '22001') {
            exception = await responseRequest({
              status: 'errorPayload',
              data: error,
              params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: error.message,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async updateTransfert(input: IRmqInput<TransfertModel>): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.transfertRepository.findOne(
          { id: input.param },
          { withDeleted: false },
        );
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: null,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          response.updated_by = input.user.name;
          result = await this.transfertRepository.update(
            { id: input.param },
            { ...response, ...input.value },
          );

          exception = await responseRequest({
            status: 'updated',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorUpdated',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }

    return exception;
  }

  async deleteTransfert(input: IRmqInput<TransfertModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.transfertRepository.findOne({
          id: input.param,
        });
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          result = await this.transfertRepository.delete(input.param);
          exception = await responseRequest({
            status: 'deleted',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorDeleted',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  // Cession
  async saveCession(input: IRmqInput<CessionModel>): Promise<any> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const valueToSave = {
            ...input.value,
            created_by: input.user.name,
          };
          result = await this.cessionRepository.save(valueToSave);
          exception = await responseRequest({
            status: 'inserted',
            data: result,
            params: {},
          });
        } catch (error) {
          if (error.code === '23505') {
            // Duplucate
            exception = await responseRequest({
              status: 'errorInserted',
              data: error,
              params: error.detail,
            });
          } else if (error.code === '22001') {
            exception = await responseRequest({
              status: 'errorPayload',
              data: error,
              params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: error.message,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async updateCession(input: IRmqInput<CessionModel>): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.cessionRepository.findOne(
          { id: input.param },
          { withDeleted: false },
        );
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: null,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          response.updated_by = input.user.name;
          result = await this.cessionRepository.update(
            { id: input.param },
            { ...response, ...input.value },
          );

          exception = await responseRequest({
            status: 'updated',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorUpdated',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }

    return exception;
  }

  async deleteCession(input: IRmqInput<CessionModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.cessionRepository.findOne({
          id: input.param,
        });
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          result = await this.cessionRepository.delete(input.param);
          exception = await responseRequest({
            status: 'deleted',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorDeleted',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  // Balance
  async saveBalance(input: IRmqInput<BalanceModel>): Promise<any> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const valueToSave = {
            ...input.value,
            created_by: input.user.name,
          };
          result = await this.balanceRepository.save(valueToSave);
          exception = await responseRequest({
            status: 'inserted',
            data: result,
            params: {},
          });
        } catch (error) {
          if (error.code === '23505') {
            // Duplucate
            exception = await responseRequest({
              status: 'errorInserted',
              data: error,
              params: error.detail,
            });
          } else if (error.code === '22001') {
            exception = await responseRequest({
              status: 'errorPayload',
              data: error,
              params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: error.message,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async updateBalance(input: IRmqInput<BalanceModel>): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.balanceRepository.findOne(
          { id: input.param },
          { withDeleted: false },
        );
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: null,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          response.updated_by = input.user.name;
          result = await this.balanceRepository.update(
            { id: input.param },
            { ...response, ...input.value },
          );

          exception = await responseRequest({
            status: 'updated',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorUpdated',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }

    return exception;
  }

  async deleteBalance(input: IRmqInput<BalanceModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.balanceRepository.findOne({
          id: input.param,
        });
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          result = await this.balanceRepository.delete(input.param);
          exception = await responseRequest({
            status: 'deleted',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorDeleted',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  // Balayure
  async saveBalayure(input: IRmqInput<SweepModel>): Promise<any> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const valueToSave = {
            ...input.value,
            created_by: input.user.name,
          };
          result = await this.sweepRepository.save(valueToSave);
          exception = await responseRequest({
            status: 'inserted',
            data: result,
            params: {},
          });
        } catch (error) {
          if (error.code === '23505') {
            // Duplucate
            exception = await responseRequest({
              status: 'errorInserted',
              data: error,
              params: error.detail,
            });
          } else if (error.code === '22001') {
            exception = await responseRequest({
              status: 'errorPayload',
              data: error,
              params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
            });
          } else {
            exception = await responseRequest({
              status: 'errorOtherRequest',
              data: error,
              params: error.message,
            });
          }
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async updateBalayure(input: IRmqInput<SweepModel>): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.sweepRepository.findOne(
          { id: input.param },
          { withDeleted: false },
        );
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: null,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          response.updated_by = input.user.name;
          result = await this.sweepRepository.update(
            { id: input.param },
            { ...response, ...input.value },
          );

          exception = await responseRequest({
            status: 'updated',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorUpdated',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }

    return exception;
  }

  async deleteBalayure(input: IRmqInput<SweepModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.sweepRepository.findOne({
          id: input.param,
        });
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          result = await this.sweepRepository.delete(input.param);
          exception = await responseRequest({
            status: 'deleted',
            data: result,
            params: {},
          });
        } catch (error) {
          exception = await responseRequest({
            status: 'errorDeleted',
            data: error,
            params: {},
          });
        }
      } else {
        exception = await responseRequest({
          status: 'unAutorized',
          data: null,
          params: 'Utilisateur inexistant.',
        });
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: 'Connexion du locataire inexistant.',
      });
    }
    return exception;
  }

  async getMainObject(
    provenance: UUIDVersion | null,
    speculation: UUIDVersion | null,
  ) {
    const object = {};
    Object.assign(object, {
      provenance: await this.mainComponent.ville(provenance),
      speculation: await this.mainComponent.commodity(speculation),
    });
    return object;
  }

  async genUnicity(objectData: any, countLot): Promise<string> {
    const nbrLot = (countLot + 1).toString().padStart(5, '0'); // Parse Number to 00000
    const entrepotName = objectData.entrepot.libelle
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(' ', '-');
    // const siteName = objectData.site.libelle
    //   .normalize('NFD')
    //   .replace(/[\u0300-\u036f]/g, '')
    //   .replace(' ', '-');

    const exportNameOrign = objectData.exportateur.raison;
    // const dates = `${this.convertIsoDate(objectData.campagne.ouverture)}#${this.convertIsoDate(objectData.campagne.fermeture)}`;
    const dates = this.convertIsoDate(objectData.campagne.ouverture);

    let exportName: string;

    if (exportNameOrign.indexOf(' ') != -1) {
      const splited = exportNameOrign.split(' ');
      if (splited.length >= 3) {
        exportName =
          splited[0].substring(0, 2) +
          splited[1].substring(0, 2) +
          splited[2].substring(0, 1);
      } else {
        exportName = splited[0].substring(0, 2) + splited[1].substring(0, 3);
      }
    } else {
      if (exportNameOrign.length > 5) {
        exportName = exportNameOrign.slice(0, 5);
      } else {
        exportName = exportNameOrign;
      }
    }

    return `${(
      dates.split('-')[0] + // Select year only
      // '/' +
      // siteName +
      '/' +
      entrepotName +
      '/' +
      exportName +
      '/' +
      nbrLot
    )
      .replace(' ', '')
      .toUpperCase()}`;
  }

  convertIsoDate(str) {
    const date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }
}

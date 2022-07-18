import { clean, clean2, roles } from '@app/saas-component/helpers/constants';
import { responseRequest } from '@app/saas-component/helpers/core';
import { TenantDecorateurService } from '@app/saas-component/helpers/decorator';
import { cleanUp } from '@app/saas-component/helpers/functions';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
import { ReportWarnModel } from '@app/saas-component/helpers/model';
import { MainComponentService } from '@app/saas-component/settings/main-component/main-component.service';
import { Inject, Injectable } from '@nestjs/common';
import { isDefined, UUIDVersion } from 'class-validator';
import {
  Connection,
  ILike,
  IsNull,
  Not,
  Raw,
  Repository,
} from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { ReportWarnEntity } from '../externe/report.entity';
import { FileUnloadingEntity } from './file-unloading/file-unloading.entity';
import { FileUnloadingModel } from './file-unloading/file-unloading.model';
import { UnloadingEntity } from './unloading.entity';
import { UnloadingModel } from './unloading.model';

@Injectable()
@TenantDecorateurService()
export class UploadingService {
  private repository: Repository<UnloadingEntity>;
  private subRepository: Repository<FileUnloadingEntity>;
  private reportRepository: Repository<ReportWarnEntity>;
  private connectionOk = true;
  private relationship = [
    'file',
    'campagne',
    'superviseur',
    'entrepot',
    'specificite',
    'exportateur',
  ];

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
    private readonly mainComponent: MainComponentService,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.repository = connection.getRepository(UnloadingEntity);
      this.subRepository = connection.getRepository(FileUnloadingEntity);
      this.reportRepository = connection.getRepository(ReportWarnEntity);
    }
  }

  async save(input: IRmqInput<UnloadingModel>): Promise<any> {
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
            superviseur_id: input.user.id,
            created_by: input.user.name,
          };
          result = await this.repository.save(valueToSave);
          if (isDefined(result)) {
            // Save file in DB table
            if (isDefined(input.file)) {
              const file = {
                ...({
                  dechargement_id: result.id,
                  filename: input.file.filename ?? input.file.key,
                  path: input.file.path ?? input.file.url,
                  aws_id: input.file.aws_id ?? null,
                } as FileUnloadingModel),
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

  async update(input: IRmqInput<UnloadingModel>): Promise<any[]> {
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

  async delete(input: IRmqInput<UnloadingModel>): Promise<any[]> {
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
          result = await this.repository.delete(input.param);

          if (isDefined(result)) {
            // Delete File
            const query = await this.subRepository.findOne({
              dechargement_id: input.param,
            });
            if (isDefined(query)) {
              await this.subRepository.delete({ dechargement_id: input.param });
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

  async softDelete(input: IRmqInput<UnloadingModel>): Promise<any[]> {
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

  async restore(input: IRmqInput<UnloadingModel>): Promise<any[]> {
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
    let exception: any;
    const result = [];

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
              : {
                  campagne_id: input.value.filter_id,
                },
          });
          if (isDefined(found)) {
            for (const item of found) {
              const mainRelation = await this.getMainObject(
                item.provenance_id,
                item.speculation_id,
              );
              const delai = this.dayDiff(
                item.created_date,
                item.date_dechargement,
              );
              const finalItem = cleanUp(item, clean);
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;
              const supervisor = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;
              const file = isDefined(item.file)
                ? cleanUp(item.file, clean)
                : null;
              const entrepot = isDefined(item.entrepot)
                ? cleanUp(item.entrepot, clean)
                : null;
              const specificite = isDefined(item.specificite)
                ? cleanUp(item.specificite, clean)
                : null;
              const exportateur = isDefined(item.exportateur)
                ? cleanUp(item.exportateur, clean)
                : null;

              result.push({
                ...finalItem,
                ...mainRelation,
                delaiSaisie: delai > 1 ? `${delai} jrs` : `${delai} jr`,
                superviseur: supervisor,
                entrepot: entrepot,
                specificite: specificite,
                exportateur: exportateur,
                campagne: campagne,
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
    return exception;
  }

  async findUnused(input: IRmqInput<QueryParam>): Promise<any[]> {
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

          result = await this.repository
            .createQueryBuilder('dech')
            .select(['dech.id', 'dech.num_fiche'])
            .leftJoin('lot', 'lots', 'dech.id = lots.dechargement_id')
            .where('lots.dechargement_id IS NULL')
            .orWhere('dech.superviseur_id = :user::uuid', {
              user: input.user.id,
            })
            .andWhere('dech.campagne_id = :camp::uuid', {
              camp: input.value.filter_id,
            })
            .withDeleted()
            .getMany();

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
                item.provenance_id,
                item.speculation_id,
              );
              const delai = this.dayDiff(
                item.created_date,
                item.date_dechargement,
              );
              const finalItem = cleanUp(item, clean);
              const supervisor = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;
              const file = isDefined(item.file)
                ? cleanUp(item.file, clean)
                : null;
              const entrepot = isDefined(item.entrepot)
                ? cleanUp(item.entrepot, clean)
                : null;
              const specificite = isDefined(item.specificite)
                ? cleanUp(item.specificite, clean)
                : null;
              const exportateur = isDefined(item.exportateur)
                ? cleanUp(item.exportateur, clean)
                : null;
              result.push({
                ...finalItem,
                ...mainRelation,
                delaiSaisie: delai > 1 ? `${delai} jrs` : `${delai} jr`,
                superviseur: supervisor,
                entrepot: entrepot,
                specificite: specificite,
                exportateur: exportateur,
                campagne: campagne,
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
                    superviseur_id: input.user.id,
                    campagne_id: input.value.filter_id,
                    num_fiche: Raw(
                      (columnAlias) =>
                        `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                      { value: `%${input.value.query}%` },
                    ),
                  },
                  {
                    superviseur_id: input.user.id,
                    campagne_id: input.value.filter_id,
                    date_dechargement: Raw(
                      (columnAlias) =>
                        `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`,
                      { value: `%${input.value.query}%` },
                    ),
                  },
                  {
                    superviseur_id: input.user.id,
                    campagne_id: input.value.filter_id,
                    tracteur: ILike(`%${input.value.query}%`),
                  },
                  {
                    superviseur_id: input.user.id,
                    campagne_id: input.value.filter_id,
                    remorque: ILike(`%${input.value.query}%`),
                  },
                  {
                    superviseur_id: input.user.id,
                    campagne_id: input.value.filter_id,
                    fournisseur: ILike(`%${input.value.query}%`),
                  },
                  {
                    superviseur_id: input.user.id,
                    campagne_id: input.value.filter_id,
                    contact_fournisseur: Raw(
                      (columnAlias) =>
                        ` CAST(${columnAlias} AS TEXT) ILIKE :value`,
                      { value: `%${input.value.query}%` },
                    ),
                  },
                  {
                    superviseur_id: input.user.id,
                    transporteur: ILike(`%${input.value.query}%`),
                    campagne_id: input.value.filter_id,
                  },
                  {
                    superviseur_id: input.user.id,
                    campagne_id: input.value.filter_id,
                    entrepot: {
                      libelle: ILike(`%${input.value.query}%`),
                    },
                  },
                  {
                    superviseur_id: input.user.id,
                    campagne_id: input.value.filter_id,
                    specificite: {
                      libelle: ILike(`%${input.value.query}%`),
                    },
                  },
                  {
                    superviseur_id: input.user.id,
                    campagne_id: input.value.filter_id,
                    exportateur: {
                      raison: ILike(`%${input.value.query}%`),
                    },
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
                    date_dechargement: Raw(
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
                    transporteur: ILike(`%${input.value.query}%`),
                    campagne_id: input.value.filter_id,
                  },
                  {
                    campagne_id: input.value.filter_id,
                    entrepot: {
                      libelle: ILike(`%${input.value.query}%`),
                    },
                  },
                  {
                    campagne_id: input.value.filter_id,
                    specificite: {
                      libelle: ILike(`%${input.value.query}%`),
                    },
                  },
                  {
                    campagne_id: input.value.filter_id,
                    exportateur: {
                      raison: ILike(`%${input.value.query}%`),
                    },
                  },
                ],
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const mainRelation = await this.getMainObject(
                item.provenance_id,
                item.speculation_id,
              );
              const delai = this.dayDiff(
                item.created_date,
                item.date_dechargement,
              );
              const finalItem = cleanUp(item, clean);
              const supervisor = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;
              const file = isDefined(item.file)
                ? cleanUp(item.file, clean)
                : null;
              const entrepot = isDefined(item.entrepot)
                ? cleanUp(item.entrepot, clean)
                : null;
              const specificite = isDefined(item.specificite)
                ? cleanUp(item.specificite, clean)
                : null;
              const exportateur = isDefined(item.exportateur)
                ? cleanUp(item.exportateur, clean)
                : null;
              result.push({
                ...finalItem,
                ...mainRelation,
                delaiSaisie: delai > 1 ? `${delai} jrs` : `${delai} jr`,
                superviseur: supervisor,
                entrepot: entrepot,
                specificite: specificite,
                exportateur: exportateur,
                campagne: campagne,
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
                item.provenance_id,
                item.speculation_id,
              );
              const delai = this.dayDiff(
                item.created_date,
                item.date_dechargement,
              );
              const finalItem = cleanUp(item, clean);
              const supervisor = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;
              const file = isDefined(item.file)
                ? cleanUp(item.file, clean)
                : null;
              const entrepot = isDefined(item.entrepot)
                ? cleanUp(item.entrepot, clean)
                : null;
              const specificite = isDefined(item.specificite)
                ? cleanUp(item.specificite, clean)
                : null;
              const exportateur = isDefined(item.exportateur)
                ? cleanUp(item.exportateur, clean)
                : null;
              result.push({
                ...finalItem,
                ...mainRelation,
                delaiSaisie: delai > 1 ? `${delai} jrs` : `${delai} jr`,
                superviseur: supervisor,
                entrepot: entrepot,
                specificite: specificite,
                exportateur: exportateur,
                campagne: campagne,
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
              ? { superviseur_id: input.user.id, id: input.param }
              : { id: input.param },
          });

          if (isDefined(found)) {
            const mainRelation = await this.getMainObject(
              found.provenance_id,
              found.specificity_id,
            );
            const delai = this.dayDiff(
              found.created_date,
              found.date_dechargement,
            );
            const finalItem = cleanUp(found, clean);
            const supervisor = isDefined(found.superviseur)
              ? cleanUp(found.superviseur, clean2)
              : null;
            const campagne = isDefined(found.campagne)
              ? cleanUp(found.campagne, clean)
              : null;
            const file = isDefined(found.file)
              ? cleanUp(found.file, clean)
              : null;
            const entrepot = isDefined(found.entrepot)
              ? cleanUp(found.entrepot, clean)
              : null;
            const specificite = isDefined(found.specificite)
              ? cleanUp(found.specificite, clean)
              : null;
            const exportateur = isDefined(found.exportateur)
              ? cleanUp(found.exportateur, clean)
              : null;
            result = {
              ...finalItem,
              ...mainRelation,
              delaiSaisie: delai > 1 ? `${delai} jrs` : `${delai} jr`,
              superviseur: supervisor,
              entrepot: entrepot,
              specificite: specificite,
              exportateur: exportateur,
              campagne: campagne,
              file: file,
            };
          }
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: Object.keys(result || {}).length,
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
            select: ['id', 'num_fiche'],
            withDeleted: false,
            where: filtering
              ? {
                  superviseur_id: input.user.id,
                  campagne_id: input.value.filter_id,
                  num_fiche: Raw(
                    (columnAlias) =>
                      `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                    { value: `%${input.value.query}%` },
                  ),
                }
              : {
                  campagne_id: input.value.filter_id,
                  num_fiche: Raw(
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
            result = found;
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

  dayDiff(d1: Date, d2: Date) {
    const date1 = new Date(this.convertIsoDate(d1));
    const date2 = new Date(this.convertIsoDate(d2));
    const diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  convertIsoDate(str: Date) {
    const date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);

    return [date.getFullYear(), mnth, day].join('-');
  }

  async getMainObject(provenance: UUIDVersion, speculation: UUIDVersion) {
    const object = {};
    Object.assign(object, {
      provenance: await this.mainComponent.ville(provenance),
      speculation: await this.mainComponent.commodity(speculation),
    });
    return object;
  }
}

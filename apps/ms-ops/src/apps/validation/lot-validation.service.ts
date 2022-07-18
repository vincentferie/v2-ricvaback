import { clean, clean1, clean2 } from '@app/saas-component/helpers/constants';
import { responseRequest } from '@app/saas-component/helpers/core';
import { TenantDecorateurService } from '@app/saas-component/helpers/decorator';
import { cleanUp } from '@app/saas-component/helpers/functions';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { isDefined, UUIDVersion } from 'class-validator';
import { Connection, ILike, IsNull, Not, Raw, Repository } from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { LotEntity } from '../externe/lot.entity';
import { UnloadingEntity } from '../externe/unloading.entity';
import { LotValidationModel } from './lot-validation.model';
import { MainComponentService } from '@app/saas-component/settings/main-component/main-component.service';

@Injectable()
@TenantDecorateurService()
export class LotsValidationService {
  private oneRepository: Repository<UnloadingEntity>;
  private twoRepository: Repository<LotEntity>;
  private connectionOk = true;
  private relationship = [
    'file',
    'campagne',
    'superviseur',
    'dechargement',
    'analyses',
    'signaler',
  ];

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
    private readonly mainComponent: MainComponentService,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.oneRepository = this.connection.getRepository(UnloadingEntity);
      this.twoRepository = this.connection.getRepository(LotEntity);
    }
  }

  async validate(input: IRmqInput<LotValidationModel>): Promise<any> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const responseUnloading = await this.oneRepository.findOne({
          where: { id: input.value.dechargement_id, validity: false },
          withDeleted: false,
        });
        const responseLot = await this.twoRepository.findOne({
          where: { id: input.value.lot_id, validity: false },
          withDeleted: false,
        });

        if (!isDefined(responseUnloading) && !isDefined(responseLot)) {
          return responseRequest({
            status: 'errorFound',
            data: null,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          delete responseLot.signaler;
          delete responseUnloading.signaler;
          delete responseUnloading.file;
          delete responseUnloading.file;
          let dech: any, lot: any;
          if (isDefined(responseUnloading)) {
            responseUnloading.updated_by = input.user.name;
            responseUnloading.validity = true;
            dech = await this.oneRepository.update(
              { id: input.value.dechargement_id },
              responseUnloading,
            );
          }
          if (isDefined(responseLot)) {
            responseLot.updated_by = input.user.name;
            responseLot.validity = true;
            lot = await this.twoRepository.update(
              { id: input.value.lot_id },
              responseLot,
            );
          }

          exception = await responseRequest({
            status: 'updated',
            data: { dechargement: dech, lot: lot },
            params: {},
          });
        } catch (error) {
          console.log(error);
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

  async authorizedUnloading(
    input: IRmqInput<LotValidationModel>,
  ): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.oneRepository.findOne({
          where: { id: input.param, validity: true },
          withDeleted: false,
        });
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: null,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          delete response.signaler;
          delete response.file;
          response.updated_by = input.user.name;
          response.validity = false;
          result = await this.oneRepository.update(
            { id: input.param },
            response,
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

  async authorized(input: IRmqInput<LotValidationModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.twoRepository.findOne({
          where: { id: input.param, validity: true },
          withDeleted: false,
        });
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: null,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          delete response.signaler;
          delete response.file;
          response.updated_by = input.user.name;
          response.validity = false;
          result = await this.twoRepository.update(
            { id: input.param },
            response,
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
          const found = await this.twoRepository.find({
            relations: this.relationship,
            withDeleted: false,
            where: { campagne_id: input.value.filter_id },
            order: { validity: 'DESC' },
          });
          if (isDefined(found)) {
            for (const item of found) {
              // Get Information required
              const mainRelation: any = await this.getMainObject(
                item.dechargement.provenance_id,
                item.speculation_id,
              );
              // Clean Up unecessary
              delete item.superviseur_id;
              delete item.campagne_id;
              delete item.site_id;
              delete item.entrepot_id;
              delete item.exportateur_id;
              delete item.speculation_id;
              delete item.specificity_id;

              const finalItem = cleanUp(item, clean);
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean1)
                : null;
              const analyses = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean1)
                : null;
              const fileLots = isDefined(item.file)
                ? cleanUp(item.file, clean1)
                : null;
              const superviseurLot = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;

              // Dechargement
              // Clean up dechargement
              delete item.dechargement.superviseur_id;
              delete item.dechargement.campagne_id;
              delete item.dechargement.provenance_id;
              delete item.dechargement.specificity_id;
              delete item.dechargement.exportateur_id;
              delete item.dechargement.entrepot_id;
              delete item.dechargement.speculation_id;

              const dechargement = isDefined(item.dechargement)
                ? cleanUp(item.dechargement, clean)
                : null;
              const superviseurDech = isDefined(item.dechargement.superviseur)
                ? cleanUp(item.dechargement.superviseur, clean2)
                : null;
              const specificite = isDefined(item.dechargement.specificite)
                ? cleanUp(item.dechargement.specificite, clean1)
                : null;
              const entrepot = isDefined(item.dechargement.entrepot)
                ? cleanUp(item.dechargement.entrepot, clean1)
                : null;
              const exportateur = isDefined(item.dechargement.exportateur)
                ? cleanUp(item.dechargement.exportateur, clean1)
                : null;
              const fileDech = isDefined(item.dechargement.file)
                ? cleanUp(item.dechargement.file, clean1)
                : null;
              const signalerDech = [];
              if (
                isDefined(item.dechargement.signaler) &&
                item.dechargement.signaler.length > 0
              ) {
                for (const elem of item.dechargement.signaler) {
                  signalerDech.push(cleanUp(elem, clean1));
                }
              }
              // Lot
              const signalerLot = [];
              if (isDefined(item.signaler) && item.signaler.length > 0) {
                for (const elem of item.signaler) {
                  signalerLot.push(cleanUp(elem, clean1));
                }
              }

              result.push({
                ...finalItem,
                analyses: analyses,
                dechargement: {
                  ...dechargement,
                  specificite: specificite,
                  entrepot: entrepot,
                  exportateur: exportateur,
                  file: fileDech,
                  signaler: signalerDech,
                  superviseur: superviseurDech,
                  provenance: mainRelation.provenance,
                  speculation: mainRelation.speculation,
                },
                campagne: campagne,
                speculation: mainRelation.speculation,
                superviseur: superviseurLot,
                file: fileLots,
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
          const [found, total] = await this.twoRepository.findAndCount({
            relations: this.relationship,
            withDeleted: false,
            where: { campagne_id: input.value.filter_id },
            order: { validity: 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              // Get Information required
              const mainRelation: any = await this.getMainObject(
                item.dechargement.provenance_id,
                item.speculation_id,
              );
              // Clean Up unecessary
              delete item.superviseur_id;
              delete item.campagne_id;
              delete item.site_id;
              delete item.entrepot_id;
              delete item.exportateur_id;
              delete item.speculation_id;
              delete item.specificity_id;

              const finalItem = cleanUp(item, clean);
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean1)
                : null;
              const analyses = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean1)
                : null;
              const fileLots = isDefined(item.file)
                ? cleanUp(item.file, clean1)
                : null;
              const superviseurLot = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;

              // Dechargement
              // Clean up dechargement
              delete item.dechargement.superviseur_id;
              delete item.dechargement.campagne_id;
              delete item.dechargement.provenance_id;
              delete item.dechargement.specificity_id;
              delete item.dechargement.exportateur_id;
              delete item.dechargement.entrepot_id;
              delete item.dechargement.speculation_id;

              const dechargement = isDefined(item.dechargement)
                ? cleanUp(item.dechargement, clean)
                : null;
              const superviseurDech = isDefined(item.dechargement.superviseur)
                ? cleanUp(item.dechargement.superviseur, clean2)
                : null;
              const specificite = isDefined(item.dechargement.specificite)
                ? cleanUp(item.dechargement.specificite, clean1)
                : null;
              const entrepot = isDefined(item.dechargement.entrepot)
                ? cleanUp(item.dechargement.entrepot, clean1)
                : null;
              const exportateur = isDefined(item.dechargement.exportateur)
                ? cleanUp(item.dechargement.exportateur, clean1)
                : null;
              const fileDech = isDefined(item.dechargement.file)
                ? cleanUp(item.dechargement.file, clean1)
                : null;
              const signalerDech = [];
              if (
                isDefined(item.dechargement.signaler) &&
                item.dechargement.signaler.length > 0
              ) {
                for (const elem of item.dechargement.signaler) {
                  signalerDech.push(cleanUp(elem, clean1));
                }
              }
              // Lot
              const signalerLot = [];
              if (isDefined(item.signaler) && item.signaler.length > 0) {
                for (const elem of item.signaler) {
                  signalerLot.push(cleanUp(elem, clean1));
                }
              }

              result.push({
                ...finalItem,
                analyses: analyses,
                dechargement: {
                  ...dechargement,
                  specificite: specificite,
                  entrepot: entrepot,
                  exportateur: exportateur,
                  file: fileDech,
                  signaler: signalerDech,
                  superviseur: superviseurDech,
                  provenance: mainRelation.provenance,
                  speculation: mainRelation.speculation,
                },
                campagne: campagne,
                speculation: mainRelation.speculation,
                superviseur: superviseurLot,
                file: fileLots,
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
          const [found, total] = await this.twoRepository.findAndCount({
            relations: this.relationship,
            withDeleted: false,
            where: [
              {
                campagne_id: input.value.filter_id,
                numero_ticket_pese: ILike(`%${input.value.query}%`),
              },
              {
                campagne_id: input.value.filter_id,
                numero_lot: ILike(`%${input.value.query}%`),
              },
              {
                campagne_id: input.value.filter_id,
                code_dechargement: Raw(
                  (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                  { value: `%${input.value.query}%` },
                ),
              },
            ],
            order: { validity: 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              // Get Information required
              const mainRelation: any = await this.getMainObject(
                item.dechargement.provenance_id,
                item.speculation_id,
              );
              // Clean Up unecessary
              delete item.superviseur_id;
              delete item.campagne_id;
              delete item.site_id;
              delete item.entrepot_id;
              delete item.exportateur_id;
              delete item.speculation_id;
              delete item.specificity_id;

              const finalItem = cleanUp(item, clean);
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean1)
                : null;
              const analyses = isDefined(item.analyses)
                ? cleanUp(item.analyses, clean1)
                : null;
              const fileLots = isDefined(item.file)
                ? cleanUp(item.file, clean1)
                : null;
              const superviseurLot = isDefined(item.superviseur)
                ? cleanUp(item.superviseur, clean2)
                : null;

              // Dechargement
              // Clean up dechargement
              delete item.dechargement.superviseur_id;
              delete item.dechargement.campagne_id;
              delete item.dechargement.provenance_id;
              delete item.dechargement.specificity_id;
              delete item.dechargement.exportateur_id;
              delete item.dechargement.entrepot_id;
              delete item.dechargement.speculation_id;

              const dechargement = isDefined(item.dechargement)
                ? cleanUp(item.dechargement, clean)
                : null;
              const superviseurDech = isDefined(item.dechargement.superviseur)
                ? cleanUp(item.dechargement.superviseur, clean2)
                : null;
              const specificite = isDefined(item.dechargement.specificite)
                ? cleanUp(item.dechargement.specificite, clean1)
                : null;
              const entrepot = isDefined(item.dechargement.entrepot)
                ? cleanUp(item.dechargement.entrepot, clean1)
                : null;
              const exportateur = isDefined(item.dechargement.exportateur)
                ? cleanUp(item.dechargement.exportateur, clean1)
                : null;
              const fileDech = isDefined(item.dechargement.file)
                ? cleanUp(item.dechargement.file, clean1)
                : null;
              const signalerDech = [];
              if (
                isDefined(item.dechargement.signaler) &&
                item.dechargement.signaler.length > 0
              ) {
                for (const elem of item.dechargement.signaler) {
                  signalerDech.push(cleanUp(elem, clean1));
                }
              }
              // Lot
              const signalerLot = [];
              if (isDefined(item.signaler) && item.signaler.length > 0) {
                for (const elem of item.signaler) {
                  signalerLot.push(cleanUp(elem, clean1));
                }
              }

              result.push({
                ...finalItem,
                analyses: analyses,
                dechargement: {
                  ...dechargement,
                  specificite: specificite,
                  entrepot: entrepot,
                  exportateur: exportateur,
                  file: fileDech,
                  signaler: signalerDech,
                  superviseur: superviseurDech,
                  provenance: mainRelation.provenance,
                  speculation: mainRelation.speculation,
                },
                campagne: campagne,
                speculation: mainRelation.speculation,
                superviseur: superviseurLot,
                file: fileLots,
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
          const found = await this.twoRepository.findOne({
            relations: this.relationship,
            withDeleted: false,
            where: { campagne_id: input.value.filter_id, id: input.param },
            order: { validity: 'DESC' },
          });

          if (isDefined(found)) {
            // Get Information required
            const mainRelation: any = await this.getMainObject(
              found.dechargement.provenance_id,
              found.speculation_id,
            );
            // Clean Up unecessary
            delete found.superviseur_id;
            delete found.campagne_id;
            delete found.site_id;
            delete found.entrepot_id;
            delete found.exportateur_id;
            delete found.speculation_id;
            delete found.specificity_id;

            const finalItem = cleanUp(found, clean);
            const campagne = isDefined(found.campagne)
              ? cleanUp(found.campagne, clean1)
              : null;
            const analyses = isDefined(found.analyses)
              ? cleanUp(found.analyses, clean1)
              : null;
            const fileLots = isDefined(found.file)
              ? cleanUp(found.file, clean1)
              : null;
            const superviseurLot = isDefined(found.superviseur)
              ? cleanUp(found.superviseur, clean2)
              : null;

            // Dechargement
            // Clean up dechargement
            delete found.dechargement.superviseur_id;
            delete found.dechargement.campagne_id;
            delete found.dechargement.provenance_id;
            delete found.dechargement.specificity_id;
            delete found.dechargement.exportateur_id;
            delete found.dechargement.entrepot_id;
            delete found.dechargement.speculation_id;

            const dechargement = isDefined(found.dechargement)
              ? cleanUp(found.dechargement, clean)
              : null;
            const superviseurDech = isDefined(found.dechargement.superviseur)
              ? cleanUp(found.dechargement.superviseur, clean2)
              : null;
            const specificite = isDefined(found.dechargement.specificite)
              ? cleanUp(found.dechargement.specificite, clean1)
              : null;
            const entrepot = isDefined(found.dechargement.entrepot)
              ? cleanUp(found.dechargement.entrepot, clean1)
              : null;
            const exportateur = isDefined(found.dechargement.exportateur)
              ? cleanUp(found.dechargement.exportateur, clean1)
              : null;
            const fileDech = isDefined(found.dechargement.file)
              ? cleanUp(found.dechargement.file, clean1)
              : null;
            const signalerDech = [];
            if (
              isDefined(found.dechargement.signaler) &&
              found.dechargement.signaler.length > 0
            ) {
              for (const elem of found.dechargement.signaler) {
                signalerDech.push(cleanUp(elem, clean1));
              }
            }
            // Lot
            const signalerLot = [];
            if (isDefined(found.signaler) && found.signaler.length > 0) {
              for (const elem of found.signaler) {
                signalerLot.push(cleanUp(elem, clean1));
              }
            }

            result = {
              ...finalItem,
              analyses: analyses,
              dechargement: {
                ...dechargement,
                specificite: specificite,
                entrepot: entrepot,
                exportateur: exportateur,
                file: fileDech,
                signaler: signalerDech,
                superviseur: superviseurDech,
                provenance: mainRelation.provenance,
                speculation: mainRelation.speculation,
              },
              campagne: campagne,
              speculation: mainRelation.speculation,
              superviseur: superviseurLot,
              file: fileLots,
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
          const [found, total] = await this.twoRepository.findAndCount({
            select: [
              'id',
              'numero_lot',
              'code_dechargement',
              'numero_ticket_pese',
            ],
            withDeleted: false,
            where: {
              campagne_id: input.value.filter_id,
              numero: Raw(
                (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                { value: `%${input.value.query}%` },
              ),
            },
            order: { validity: 'DESC' },
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

  async getMainObject(provenance: UUIDVersion, speculation: UUIDVersion) {
    const object = {};
    Object.assign(object, {
      provenance: await this.mainComponent.ville(provenance),
      speculation: await this.mainComponent.commodity(speculation),
    });
    return object;
  }
}

import { clean, clean1 } from '@app/saas-component/helpers/constants';
import { responseRequest } from '@app/saas-component/helpers/core';
import { TenantDecorateurService } from '@app/saas-component/helpers/decorator';
import { StateBooking } from '@app/saas-component/helpers/enums';
import {
  cleanUp,
  createIndex,
} from '@app/saas-component/helpers/functions';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';
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
import { ContainerPottingPlanEntity } from './potting-plan-container/potting-plan-container.entity';
import { ContainerPottingPlanModel } from './potting-plan-container/potting-plan-container.model';
import { LotPottingPlanEntity } from './potting-plan-lots/potting-plan-lots.entity';
import { LotPottingPlanModel } from './potting-plan-lots/potting-plan-lots.model';
import { PottingPlanEntity } from './potting-plan.entity';
import { PottingPlanModel } from './potting-plan.model';

@Injectable()
@TenantDecorateurService()
export class PottingPlanService {
  private repository: Repository<PottingPlanEntity>;
  private containerRepository: Repository<ContainerPottingPlanEntity>;
  private lotRepository: Repository<LotPottingPlanEntity>;
  private connectionOk = true;
  private relationship = [
    'entrepot',
    'transitaire',
    'containerPlanEmpotage',
    'lotPlanEmpotage',
    'executionEmpotage',
  ];

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.repository = connection.getRepository(PottingPlanEntity);
      this.containerRepository = connection.getRepository(
        ContainerPottingPlanEntity,
      );
      this.lotRepository = connection.getRepository(LotPottingPlanEntity);
    }
  }

  async save(input: IRmqInput<PottingPlanModel>): Promise<any> {
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
          result = await this.repository.save(valueToSave);
          if (isDefined(result)) {
            let containerPlanEmpotage: [any];
            let lotPlanEmpotage: [any];

            // Save container
            for (const item of input.value.conteneurs) {
              const data: any = {
                created_by: input.user.name,
                ...({
                  plan_empotage_id: result.id,
                  conteneur_id: item.conteneur_id,
                } as ContainerPottingPlanModel),
              };
              containerPlanEmpotage.push(
                await this.containerRepository.save(data),
              );
            }
            // Save lots
            for (const item of input.value.lots) {
              const data: any = {
                created_by: input.user.name,
                ...({
                  plan_empotage_id: result.id,
                  lot_id: item.lot_id,
                  nbr_sacs: item.nbr_sacs,
                } as LotPottingPlanModel),
              };
              lotPlanEmpotage.push(await this.lotRepository.save(data));
            }
            result.containerPlanEmpotage = containerPlanEmpotage;
            result.lotPlanEmpotage = lotPlanEmpotage;
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

  async update(input: IRmqInput<PottingPlanModel>): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.repository.findOne(
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

  async close(input: IRmqInput<PottingPlanModel>): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.repository.findOne(
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
          response.state = StateBooking.terminer;
          result = await this.repository.update({ id: input.param }, response);

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

  async delete(input: IRmqInput<PottingPlanModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.repository.findOne({ id: input.param });
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
          });
        }
        try {
          result = await this.repository.delete(input.param);
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

  async softDelete(input: IRmqInput<PottingPlanModel>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.repository.findOne(
          { id: input.param },
          { withDeleted: false },
        );
        if (!isDefined(response)) {
          return responseRequest({
            status: 'errorFound',
            data: response,
            params: `Aucun element ne correspont au paramètre id ${input.param}`,
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

  async restore(input: IRmqInput<PottingPlanModel>): Promise<any[]> {
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
          const found = await this.repository.find({
            relations: this.relationship,
            withDeleted: false,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const entrepot = isDefined(item.entrepot)
                ? cleanUp(item.entrepot, clean1)
                : null;
              const containerPlanEmpotage = cleanUp(
                item.containerPlanEmpotage,
                clean1,
              );
              const lotPlanEmpotage = isDefined(item.lotPlanEmpotage)
                ? cleanUp(item.lotPlanEmpotage, clean1)
                : null;
              const executionEmpotage = isDefined(item.executionEmpotage)
                ? cleanUp(item.executionEmpotage, clean1)
                : null;
              result.push({
                ...finalItem,
                entrepot: entrepot,
                containerPlanEmpotage: containerPlanEmpotage,
                lotPlanEmpotage: lotPlanEmpotage,
                executionEmpotage: executionEmpotage,
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
          const [found, total] = await this.repository.findAndCount({
            relations: this.relationship,
            withDeleted: false,
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const entrepot = isDefined(item.entrepot)
                ? cleanUp(item.entrepot, clean1)
                : null;
              const containerPlanEmpotage = cleanUp(
                item.containerPlanEmpotage,
                clean1,
              );
              const lotPlanEmpotage = isDefined(item.lotPlanEmpotage)
                ? cleanUp(item.lotPlanEmpotage, clean1)
                : null;
              const executionEmpotage = isDefined(item.executionEmpotage)
                ? cleanUp(item.executionEmpotage, clean1)
                : null;
              result.push({
                ...finalItem,
                entrepot: entrepot,
                containerPlanEmpotage: containerPlanEmpotage,
                lotPlanEmpotage: lotPlanEmpotage,
                executionEmpotage: executionEmpotage,
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
          const [found, total] = await this.repository.findAndCount({
            relations: this.relationship,
            withDeleted: false,
            where: [
              {
                numero: ILike(`%${input.value.query}%`),
              },
              {
                containerPlanEmpotage: {
                  conteneur: { numero: ILike(`%${input.value.query}%`) },
                },
              },
              {
                entrepot: { libelle: ILike(`%${input.value.query}%`) },
              },
              {
                lotPlanEmpotage: {
                  lot: [
                    { numero_lot: ILike(`%${input.value.query}%`) },
                    { code_dechargement: ILike(`%${input.value.query}%`) },
                  ],
                },
              },
              // {
              //   transitaire: {raison: Raw(
              //     (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
              //     { value: `%${input.value.query}%` },
              //   )},
              // },
              {
                date_execution: Raw(
                  (columnAlias) =>
                    `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`,
                  { value: `%${input.value.query}%` },
                ),
              },
            ],
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const entrepot = isDefined(item.entrepot)
                ? cleanUp(item.entrepot, clean1)
                : null;
              const containerPlanEmpotage = cleanUp(
                item.containerPlanEmpotage,
                clean1,
              );
              const lotPlanEmpotage = isDefined(item.lotPlanEmpotage)
                ? cleanUp(item.lotPlanEmpotage, clean1)
                : null;
              const executionEmpotage = isDefined(item.executionEmpotage)
                ? cleanUp(item.executionEmpotage, clean1)
                : null;
              result.push({
                ...finalItem,
                entrepot: entrepot,
                containerPlanEmpotage: containerPlanEmpotage,
                lotPlanEmpotage: lotPlanEmpotage,
                executionEmpotage: executionEmpotage,
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
          const [found, total] = await this.repository.findAndCount({
            relations: this.relationship,
            withDeleted: true,
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const entrepot = isDefined(item.entrepot)
                ? cleanUp(item.entrepot, clean1)
                : null;
              const containerPlanEmpotage = cleanUp(
                item.containerPlanEmpotage,
                clean1,
              );
              const lotPlanEmpotage = isDefined(item.lotPlanEmpotage)
                ? cleanUp(item.lotPlanEmpotage, clean1)
                : null;
              const executionEmpotage = isDefined(item.executionEmpotage)
                ? cleanUp(item.executionEmpotage, clean1)
                : null;
              result.push({
                ...finalItem,
                entrepot: entrepot,
                containerPlanEmpotage: containerPlanEmpotage,
                lotPlanEmpotage: lotPlanEmpotage,
                executionEmpotage: executionEmpotage,
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
          const found = await this.repository.findOne({
            relations: this.relationship,
            withDeleted: false,
            where: { id: input.param },
          });

          if (isDefined(found)) {
            const finalItem = cleanUp(found, clean);
            const entrepot = isDefined(found.entrepot)
              ? cleanUp(found.entrepot, clean1)
              : null;
            const containerPlanEmpotage = cleanUp(
              found.containerPlanEmpotage,
              clean1,
            );
            const lotPlanEmpotage = isDefined(found.lotPlanEmpotage)
              ? cleanUp(found.lotPlanEmpotage, clean1)
              : null;
            const executionEmpotage = isDefined(found.executionEmpotage)
              ? cleanUp(found.executionEmpotage, clean1)
              : null;
            result = {
              ...finalItem,
              entrepot: entrepot,
              containerPlanEmpotage: containerPlanEmpotage,
              lotPlanEmpotage: lotPlanEmpotage,
              executionEmpotage: executionEmpotage,
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
          const [found, total] = await this.repository.findAndCount({
            select: ['id', 'numero'],
            withDeleted: false,
            where: {
              numero: Raw(
                (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
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

  async findNotclosed(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any, result: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const result = await this.repository.find({
            select: ['id', 'numero'],
            withDeleted: false,
            where: {
              entrepot_id: input.param,
              state: StateBooking.encours,
            },
          });

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
}

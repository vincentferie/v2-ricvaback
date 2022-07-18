import { clean, clean1 } from '@app/saas-component/helpers/constants';
import { responseRequest } from '@app/saas-component/helpers/core';
import { TenantDecorateurService } from '@app/saas-component/helpers/decorator';
import { cleanUp, createIndex } from '@app/saas-component/helpers/functions';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { Connection, ILike, IsNull, Not, Raw, Repository } from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { DetailsExecutionEntity } from './detail/detail-execution.entity';
import { PottingExecutionEntity } from './potting-execution.entity';
import { PottingExecutionModel } from './potting-execution.model';

@Injectable()
@TenantDecorateurService()
export class PottingExecutionService {
  private repository: Repository<PottingExecutionEntity>;
  private subRepository: Repository<DetailsExecutionEntity>;
  private connectionOk = true;
  private relationship = ['details', 'planEmpotage', 'conteneur'];

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.repository = connection.getRepository(PottingExecutionEntity);
      this.subRepository = connection.getRepository(DetailsExecutionEntity);
    }
  }

  async save(input: IRmqInput<[PottingExecutionModel]>): Promise<any> {
    const result = [];
    let exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          for (const item of input.value) {
            // Set Potting exec
            const valueToSave = {
              ...item,
              created_by: input.user.name,
            };
            const exec = await this.repository.save(valueToSave);
            const det = [];
            // Set details
            for (const val of item.details) {
              const itemToSave = {
                ...val,
                plan_execution_id: exec.id,
                created_by: input.user.name,
              };
              const exec2 = await this.subRepository.save(itemToSave);
              det.push(exec2);
            }
            result.push({ ...exec, details: det });
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

  async update(input: IRmqInput<PottingExecutionModel>): Promise<any[]> {
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

  async delete(input: IRmqInput<PottingExecutionModel>): Promise<any[]> {
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

  async softDelete(input: IRmqInput<PottingExecutionModel>): Promise<any[]> {
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

  async restore(input: IRmqInput<PottingExecutionModel>): Promise<any[]> {
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
              const details = isDefined(item.details)
                ? cleanUp(item.details, clean1)
                : null;
              const planEmpotage = isDefined(item.planEmpotage)
                ? cleanUp(item.planEmpotage, clean1)
                : null;
              const conteneur = isDefined(item.conteneur)
                ? cleanUp(item.conteneur, clean1)
                : null;
              result.push({
                ...finalItem,
                details: details,
                planEmpotage: planEmpotage,
                conteneur: conteneur,
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
              const details = isDefined(item.details)
                ? cleanUp(item.details, clean1)
                : null;
              const planEmpotage = isDefined(item.planEmpotage)
                ? cleanUp(item.planEmpotage, clean1)
                : null;
              const conteneur = isDefined(item.conteneur)
                ? cleanUp(item.conteneur, clean1)
                : null;
              result.push({
                ...finalItem,
                details: details,
                planEmpotage: planEmpotage,
                conteneur: conteneur,
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
                planEmpotage: { numero: ILike(`%${input.value.query}%`) },
              },
              {
                conteneur: {
                  numero: Raw(
                    (columnAlias) =>
                      `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                    { value: `%${input.value.query}%` },
                  ),
                },
              },
            ],
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const details = isDefined(item.details)
                ? cleanUp(item.details, clean1)
                : null;
              const planEmpotage = isDefined(item.planEmpotage)
                ? cleanUp(item.planEmpotage, clean1)
                : null;
              const conteneur = isDefined(item.conteneur)
                ? cleanUp(item.conteneur, clean1)
                : null;
              result.push({
                ...finalItem,
                details: details,
                planEmpotage: planEmpotage,
                conteneur: conteneur,
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
              const details = isDefined(item.details)
                ? cleanUp(item.details, clean1)
                : null;
              const planEmpotage = isDefined(item.planEmpotage)
                ? cleanUp(item.planEmpotage, clean1)
                : null;
              const conteneur = isDefined(item.conteneur)
                ? cleanUp(item.conteneur, clean1)
                : null;
              result.push({
                ...finalItem,
                details: details,
                planEmpotage: planEmpotage,
                conteneur: conteneur,
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
            const details = isDefined(found.details)
              ? cleanUp(found.details, clean1)
              : null;
            const planEmpotage = isDefined(found.planEmpotage)
              ? cleanUp(found.planEmpotage, clean1)
              : null;
            const conteneur = isDefined(found.conteneur)
              ? cleanUp(found.conteneur, clean1)
              : null;
            result = {
              ...finalItem,
              details: details,
              planEmpotage: planEmpotage,
              conteneur: conteneur,
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
            withDeleted: false,
            where: [
              {
                planEmpotage: { numero: ILike(`%${input.value.query}%`) },
              },
              {
                conteneur: {
                  numero: Raw(
                    (columnAlias) =>
                      `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                    { value: `%${input.value.query}%` },
                  ),
                },
              },
            ],
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

  async findLotExecution(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const found = await this.subRepository
            .createQueryBuilder('details')
            .select([
              'lots.id',
              'lots.numero_lot',
              'lots.numero_ticket_pese',
              '(planLot.nbr_sacs - SUM(details.nbr_sacs)) as sac_restant',
            ])
            .innerJoin('lot', 'lots', 'lots.id = details.lot_id')
            // .innerJoin('details.lot', 'detlot', 'lot.id = details.lot_id')
            .innerJoin('analyse_lot', 'ana', 'lots.id = ana.lot_id')
            .leftJoin(
              'cashew.plan_empotage_lots',
              'planLot',
              'lots.id = planLot.lot_id',
            )
            .where('(planLot.nbr_sacs - SUM(details.nbr_sacs)) > 0')
            .andWhere('planLot.plan_empotage_id = :id::uuid', {
              id: input.param,
            })
            .orWhere('planLot.entrepot_id = :uuid1::uuid', {
              uuid1: input.value.filter_id,
            })
            .orWhere('planLot.entrepot_id = :uuid2::uuid', {
              uuid2: input.value.filter_two_id,
            })
            .orWhere('planLot.entrepot_id = :uuid3::uuid', {
              uuid3: input.value.filter_three_id,
            })
            .orWhere('planLot.entrepot_id = :uuid4::uuid', {
              uuid4: input.value.filter_four_id,
            })
            .andWhere('lots.validity = :validity::boolean', { validity: true })
            .groupBy('details.lot_id')
            .withDeleted()
            .getMany();

          for (const item of found) {
            const finalItem = cleanUp(item, clean);

            result.push({
              ...finalItem,
            });
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
}

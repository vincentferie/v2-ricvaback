import { clean, clean2 } from '@app/saas-component/helpers/constants';
import { responseRequest } from '@app/saas-component/helpers/core';
import { TenantDecorateurService } from '@app/saas-component/helpers/decorator';
import { cleanUp } from '@app/saas-component/helpers/functions';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { Connection, IsNull, Not, Raw, Repository } from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { TenantCampagneEntity } from './campagne.entity';
import { CampagneModel } from './campagne.model';
import { MainComponentService } from '@app/saas-component/settings/main-component/main-component.service';

@Injectable()
@TenantDecorateurService()
export class CampagneService {
  private repository: Repository<TenantCampagneEntity>;
  private connectionOk = true;

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly mainComponent: MainComponentService,
    private readonly verifUser: VerifUser,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.repository = connection.getRepository(TenantCampagneEntity);
    }
  }

  async save(input: IRmqInput<CampagneModel>): Promise<any> {
    let result: any, exception: any;
    let valueToSave;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );

      if (userExist) {
        try {
          valueToSave = {
            ...input.value,
            created_by: input.user.name,
          };
          result = await this.repository.save(valueToSave);
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

  async update(input: IRmqInput<CampagneModel>): Promise<any[]> {
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

  async delete(input: IRmqInput<CampagneModel>): Promise<any[]> {
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

  async softDelete(input: IRmqInput<CampagneModel>): Promise<any[]> {
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

  async restore(input: IRmqInput<CampagneModel>): Promise<any[]> {
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
            withDeleted: false,
            order: { ouverture: 'DESC' },
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const masterCampagne = await this.mainComponent.campagne(
                item.campagne_id,
              );
              result.push({
                ...finalItem,
                masterCampagne: masterCampagne,
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
            withDeleted: false,
            order: { ouverture: 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const masterCampagne = await this.mainComponent.campagne(
                item.campagne_id,
              );
              result.push({
                ...finalItem,
                masterCampagne: masterCampagne,
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
            // relations: this.relationship,
            withDeleted: false,
            where: [
              {
                libelle: Raw(
                  (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                  { value: `%${input.value.query}%` },
                ),
              },
              {
                ouverture: Raw(
                  (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                  { value: `%${input.value.query}%` },
                ),
              },
              {
                fermeture: Raw(
                  (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                  { value: `%${input.value.query}%` },
                ),
              },
            ],
            order: { ouverture: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const masterCampagne = await this.mainComponent.campagne(
                item.campagne_id,
              );
              result.push({
                ...finalItem,
                masterCampagne: masterCampagne,
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
            // relations: this.relationship,
            withDeleted: true,
            order: { ouverture: 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              // const entrepots = cleanUp(item.entrepots, clean2);

              result.push({
                ...finalItem,
                // entrepots: entrepots,
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
            select: ['id', 'libelle', 'ouverture', 'fermeture'],
            withDeleted: false,
            where: [
              {
                libelle: Raw(
                  (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                  { value: `%${input.value.query}%` },
                ),
              },
              {
                ouverture: Raw(
                  (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                  { value: `%${input.value.query}%` },
                ),
              },
              {
                fermeture: Raw(
                  (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                  { value: `%${input.value.query}%` },
                ),
              },
            ],
            order: { ouverture: 'DESC' },
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
            // relations: this.relationship,
            withDeleted: false,
            where: { id: input.param },
          });

          if (isDefined(found)) {
            const finalItem = cleanUp(found, clean);
            const masterCampagne = await this.mainComponent.campagne(
              found.campagne_id,
            );
            result = {
              ...finalItem,
              masterCampagne: masterCampagne,
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

  async findUnClosed(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any, result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const found = await this.repository.find({
            withDeleted: false,
            where: { state: true },
            order: { ouverture: 'DESC' },
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const masterCampagne = await this.mainComponent.campagne(
                item.campagne_id,
              );
              result.push({
                ...finalItem,
                masterCampagne: masterCampagne,
              });
            }
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
}

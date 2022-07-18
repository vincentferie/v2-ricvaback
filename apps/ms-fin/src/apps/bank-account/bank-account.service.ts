import { clean } from '@app/saas-component/helpers/constants';
import { responseRequest } from '@app/saas-component/helpers/core';
import { TenantDecorateurService } from '@app/saas-component/helpers/decorator';
import { cleanUp, createIndex } from '@app/saas-component/helpers/functions';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
import { MainComponentService } from '@app/saas-component/settings/main-component/main-component.service';
import { Inject, Injectable } from '@nestjs/common';
import { isDefined, isNotEmpty, UUIDVersion } from 'class-validator';
import { Connection, IsNull, Not, QueryRunner, Raw, Repository } from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { BankAccountEntity } from './bank-account.entity';
import { BankAccountModel } from './bank-account.model';
import { SubBankAccountEntity } from './sub-account/sub-account.entity';
import { SubBankAccountModel } from './sub-account/sub-account.model';
import { MovementAccount } from '../../helpers/services/movement/movement.service';

@Injectable()
@TenantDecorateurService()
export class BankAccountService {
  private repository: Repository<BankAccountEntity>;
  private subRepository: Repository<SubBankAccountEntity>;
  private connectionOk = true;
  private relationship = ['campagne', 'sousCompte'];

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
    private readonly mainComponent: MainComponentService,
    private readonly movementAcc: MovementAccount,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.repository = connection.getRepository(BankAccountEntity);
      this.subRepository = connection.getRepository(SubBankAccountEntity);
    }
  }

  async save(input: IRmqInput<BankAccountModel>): Promise<any> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const valueToSave = {
            campagne_id: input.value.campagne_id,
            banque_id: input.value.banque_id,
            solde: input.value.solde,
            created_by: input.user.name,
          };
          result = await this.repository.save(valueToSave);
          const subAccount = [];
          if (isDefined(result)) {
            if (
              isDefined(input.value.sousCompte) &&
              input.value.sousCompte.length > 0
            ) {
              for (const item of input.value.sousCompte) {
                const value = {
                  ...item,
                  compte_banque_id: result.id,
                  mouvement: null,
                };
                const subaccount = await this.subRepository.save(value);
                subAccount.push(subaccount);
              }
            }
          }
          result = {
            ...result,
            sousCompte: subAccount,
          };
          // Apply mouvement
          const movementSave = await this.movementAcc.add(
            this.connection,
            subAccount,
            input.user.name,
          );
          exception = await responseRequest({
            status: 'inserted',
            data: { ...result, mouvement: movementSave },
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

  // async update(input: IRmqInput<BankAccountModel>): Promise<any[]> {
  //   let exception: any, result: any;

  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       const response = await this.repository.findOne(
  //         { id: input.param },
  //         { withDeleted: false },
  //       );
  //       if (!isDefined(response)) {
  //         return responseRequest({
  //           status: 'errorFound',
  //           data: null,
  //           params: `Aucun element ne correspont au paramètre id ${input.param}`,
  //         });
  //       }
  //       try {
  //         response.updated_by = input.user.name;
  //         result = await this.repository.update(
  //           { id: input.param },
  //           { ...response, ...input.value },
  //         );

  //         const newResponse = await this.repository.findOne(
  //           { id: input.param },
  //           { relations: ['sousCompte'], withDeleted: false },
  //         );
  //         const movementSave = await this.movementAcc.updateAccount(
  //           this.connection,
  //           newResponse,
  //           input.user.name,
  //         );

  //         exception = await responseRequest({
  //           status: 'updated',
  //           data: { ...result, mouvement: movementSave },
  //           params: {},
  //         });
  //       } catch (error) {
  //         exception = await responseRequest({
  //           status: 'errorUpdated',
  //           data: error,
  //           params: {},
  //         });
  //       }
  //     } else {
  //       exception = await responseRequest({
  //         status: 'unAutorized',
  //         data: null,
  //         params: 'Utilisateur inexistant.',
  //       });
  //     }
  //   } else {
  //     exception = await responseRequest({
  //       status: 'errorOtherRequest',
  //       data: null,
  //       params: 'Connexion du locataire inexistant.',
  //     });
  //   }

  //   return exception;
  // }

  // async delete(input: IRmqInput<BankAccountModel>): Promise<any[]> {
  //   let exception: any, result: any;
  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       const response = await this.repository.findOne({ id: input.param });
  //       if (!isDefined(response)) {
  //         return responseRequest({
  //           status: 'errorFound',
  //           data: response,
  //           params: `Aucun element ne correspont au paramètre id ${input.param}`,
  //         });
  //       }
  //       try {
  //         result = await this.repository.delete(input.param);
  //         exception = await responseRequest({
  //           status: 'deleted',
  //           data: result,
  //           params: {},
  //         });
  //       } catch (error) {
  //         exception = await responseRequest({
  //           status: 'errorDeleted',
  //           data: error,
  //           params: {},
  //         });
  //       }
  //     } else {
  //       exception = await responseRequest({
  //         status: 'unAutorized',
  //         data: null,
  //         params: 'Utilisateur inexistant.',
  //       });
  //     }
  //   } else {
  //     exception = await responseRequest({
  //       status: 'errorOtherRequest',
  //       data: null,
  //       params: 'Connexion du locataire inexistant.',
  //     });
  //   }
  //   return exception;
  // }

  async saveSub(input: IRmqInput<SubBankAccountModel>): Promise<any> {
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
            mouvement: null,
            created_by: input.user.name,
          };
          result = await this.subRepository.save(valueToSave);
          // apply movement on account
          const movementSave = await this.movementAcc.add(
            this.connection,
            result,
            input.user.name,
          );

          exception = await responseRequest({
            status: 'inserted',
            data: { ...result, mouvement: movementSave },
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

  async updateSub(input: IRmqInput<SubBankAccountModel>): Promise<any[]> {
    let exception: any, result: any;

    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        const response = await this.subRepository.findOne(
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
          response.libelle = isDefined(input.value.libelle)
            ? input.value.libelle
            : response.libelle;
          response.num_ref = isDefined(input.value.num_ref)
            ? input.value.num_ref
            : response.num_ref;
          response.date = isDefined(input.value.date)
            ? input.value.date
            : response.date;
          response.updated_by = input.user.name;

          result = await this.subRepository.update(
            { id: input.param },
            response,
          );

          let movementSave: boolean;
          if (isDefined(input.value.mouvement)) {
            // apply movement on account
            movementSave = await this.movementAcc.treatment(
              this.connection,
              input.value.mouvement,
              input.user.name,
            );
          }
          exception = await responseRequest({
            status: 'updated',
            data: { ...result, mouvement: movementSave },
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

  // async deleteSub(input: IRmqInput<SubBankAccountModel>): Promise<any[]> {
  //   let exception: any, result: any;
  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       const response = await this.subRepository.findOne({ id: input.param });
  //       if (!isDefined(response)) {
  //         return responseRequest({
  //           status: 'errorFound',
  //           data: response,
  //           params: `Aucun element ne correspont au paramètre id ${input.param}`,
  //         });
  //       }
  //       try {
  //         result = await this.subRepository.delete(input.param);
  //         exception = await responseRequest({
  //           status: 'deleted',
  //           data: result,
  //           params: {},
  //         });
  //       } catch (error) {
  //         exception = await responseRequest({
  //           status: 'errorDeleted',
  //           data: error,
  //           params: {},
  //         });
  //       }
  //     } else {
  //       exception = await responseRequest({
  //         status: 'unAutorized',
  //         data: null,
  //         params: 'Utilisateur inexistant.',
  //       });
  //     }
  //   } else {
  //     exception = await responseRequest({
  //       status: 'errorOtherRequest',
  //       data: null,
  //       params: 'Connexion du locataire inexistant.',
  //     });
  //   }
  //   return exception;
  // }

  async softDelete(input: IRmqInput<BankAccountModel>): Promise<any[]> {
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

  async restore(input: IRmqInput<BankAccountModel>): Promise<any[]> {
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
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;

              const subAccount = [];
              if (isDefined(item.sousCompte) && item.sousCompte.length > 0) {
                for (const elm of item.sousCompte) {
                  if (isDefined(elm.mouvement) && elm.mouvement.length > 0) {
                    const mouv = [];
                    for (const key of elm.mouvement) {
                      mouv.push(isDefined(key) ? cleanUp(key, clean) : null);
                    }
                    // Sort in Descending order (high to low)
                    const sortedDesc = mouv.sort(
                      (a, b) => Number(b.date) - Number(a.date),
                    );
                    subAccount.push(
                      isDefined(elm)
                        ? cleanUp({ ...elm, mouvement: sortedDesc }, clean)
                        : null,
                    );
                  }
                }
              }
              const mainResult = await this.getMainObject(item.banque_id);
              result.push({
                ...finalItem,
                campagne: campagne,
                ...mainResult,
                sousCompte: subAccount.length > 0 ? subAccount : null,
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
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;

              const subAccount = [];
              if (isDefined(item.sousCompte) && item.sousCompte.length > 0) {
                for (const elm of item.sousCompte) {
                  if (isDefined(elm.mouvement) && elm.mouvement.length > 0) {
                    const mouv = [];
                    for (const key of elm.mouvement) {
                      mouv.push(isDefined(key) ? cleanUp(key, clean) : null);
                    }
                    // Sort in Descending order (high to low)
                    const sortedDesc = mouv.sort(
                      (a, b) => Number(b.date) - Number(a.date),
                    );
                    subAccount.push(
                      isDefined(elm)
                        ? cleanUp({ ...elm, mouvement: sortedDesc }, clean)
                        : null,
                    );
                  }
                }
              }
              const mainResult = await this.getMainObject(item.banque_id);
              result.push({
                ...finalItem,
                campagne: campagne,
                ...mainResult,
                sousCompte: subAccount.length > 0 ? subAccount : null,
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
            where: {
              sousCompte: [
                {
                  libelle: Raw(
                    (columnAlias) =>
                      `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                    { value: `%${input.value.query}%` },
                  ),
                },
                {
                  num_ref: Raw(
                    (columnAlias) =>
                      `CAST(${columnAlias} AS TEXT) ILIKE :value`,
                    { value: `%${input.value.query}%` },
                  ),
                },
              ],
            },
            order: { created_date: input.value.order ?? 'DESC' },
            skip: +input.value.offset,
            take: +input.value.take,
          });

          if (isDefined(found)) {
            for (const item of found) {
              const finalItem = cleanUp(item, clean);
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;

              const subAccount = [];
              if (isDefined(item.sousCompte) && item.sousCompte.length > 0) {
                for (const elm of item.sousCompte) {
                  if (isDefined(elm.mouvement) && elm.mouvement.length > 0) {
                    const mouv = [];
                    for (const key of elm.mouvement) {
                      mouv.push(isDefined(key) ? cleanUp(key, clean) : null);
                    }
                    // Sort in Descending order (high to low)
                    const sortedDesc = mouv.sort(
                      (a, b) => Number(b.date) - Number(a.date),
                    );
                    subAccount.push(
                      isDefined(elm)
                        ? cleanUp({ ...elm, mouvement: sortedDesc }, clean)
                        : null,
                    );
                  }
                }
              }
              const mainResult = await this.getMainObject(item.banque_id);
              result.push({
                ...finalItem,
                campagne: campagne,
                ...mainResult,
                sousCompte: subAccount.length > 0 ? subAccount : null,
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
              const campagne = isDefined(item.campagne)
                ? cleanUp(item.campagne, clean)
                : null;

              const subAccount = [];
              if (isDefined(item.sousCompte) && item.sousCompte.length > 0) {
                for (const elm of item.sousCompte) {
                  if (isDefined(elm.mouvement) && elm.mouvement.length > 0) {
                    const mouv = [];
                    for (const key of elm.mouvement) {
                      mouv.push(isDefined(key) ? cleanUp(key, clean) : null);
                    }
                    // Sort in Descending order (high to low)
                    const sortedDesc = mouv.sort(
                      (a, b) => Number(b.date) - Number(a.date),
                    );
                    subAccount.push(
                      isDefined(elm)
                        ? cleanUp({ ...elm, mouvement: sortedDesc }, clean)
                        : null,
                    );
                  }
                }
              }
              const mainResult = await this.getMainObject(item.banque_id);
              result.push({
                ...finalItem,
                campagne: campagne,
                ...mainResult,
                sousCompte: subAccount.length > 0 ? subAccount : null,
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
            const campagne = isDefined(found.campagne)
              ? cleanUp(found.campagne, clean)
              : null;

            const subAccount = [];
            if (isDefined(found.sousCompte) && found.sousCompte.length > 0) {
              for (const elm of found.sousCompte) {
                if (isDefined(elm.mouvement) && elm.mouvement.length > 0) {
                  const mouv = [];
                  for (const key of elm.mouvement) {
                    mouv.push(isDefined(key) ? cleanUp(key, clean) : null);
                  }
                  // Sort in Descending order (high to low)
                  const sortedDesc = mouv.sort(
                    (a, b) => Number(b.date) - Number(a.date),
                  );
                  subAccount.push(
                    isDefined(elm)
                      ? cleanUp({ ...elm, mouvement: sortedDesc }, clean)
                      : null,
                  );
                }
              }
              const mainResult = await this.getMainObject(found.banque_id);
              result.push({
                ...finalItem,
                campagne: campagne,
                ...mainResult,
                sousCompte: subAccount.length > 0 ? subAccount : null,
              });
            }
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

  async getMainObject(banque: UUIDVersion) {
    const object = {};
    Object.assign(object, {
      banque: await this.mainComponent.banque(banque),
    });
    return object;
  }
}

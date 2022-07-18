import { clean, clean1 } from '@app/saas-component/helpers/constants';
import { responseRequest } from '@app/saas-component/helpers/core';
import { TenantDecorateurService } from '@app/saas-component/helpers/decorator';
import { cleanUp, createIndex } from '@app/saas-component/helpers/functions';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
import { MainComponentService } from '@app/saas-component/settings/main-component/main-component.service';
import { Inject, Injectable } from '@nestjs/common';
import { isDefined, UUIDVersion } from 'class-validator';
import { Connection, IsNull, Not, QueryRunner, Raw, Repository } from 'typeorm';
import { VerifUser } from '../../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../../helpers/providers/tenant.provider';
import { MovementAccount } from '../../../helpers/services/movement/movement.service';
import { TypeMovement } from '@app/saas-component/helpers/enums';
import { PledgeProcessingEntity } from './pledge-letters.entity';
import { PledgeProcessingModel } from './pledge-letters.model';

@Injectable()
@TenantDecorateurService()
export class PledgeProcessingService {
  private repository: Repository<PledgeProcessingEntity>;
  private relationship = ['exportateur', 'compte', 'sousCompte'];
  private connectionOk = true;

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
    private readonly mainComponent: MainComponentService,
    private readonly movementAcc: MovementAccount,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.repository = connection.getRepository(PledgeProcessingEntity);
    }
  }

  // async save(input: IRmqInput<PledgeProcessingModel>): Promise<any> {
  //   let result: any, exception: any;
  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       try {
  //         // const movement = input.value.;
  //         // delete input.value.mouvement;
  //         const valueToSave = {
  //           ...input.value,
  //           created_by: input.user.name,
  //         };
  //         result = await this.repository.save(valueToSave);

  //         // Apply movement on account
  //         // const movementSave = await this.movementAcc.treatment(
  //         //   this.connection,
  //         //   // movement,
  //         //   input.user.name,
  //         // );

  //         exception = await responseRequest({
  //           status: 'inserted',
  //           data: result,
  //           params: {},
  //         });
  //       } catch (error) {
  //         if (error.code === '23505') {
  //           // Duplucate
  //           exception = await responseRequest({
  //             status: 'errorInserted',
  //             data: error,
  //             params: error.detail,
  //           });
  //         } else if (error.code === '22001') {
  //           exception = await responseRequest({
  //             status: 'errorPayload',
  //             data: error,
  //             params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
  //           });
  //         } else {
  //           exception = await responseRequest({
  //             status: 'errorOtherRequest',
  //             data: error,
  //             params: error.message,
  //           });
  //         }
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

  // async update(input: IRmqInput<PledgeProcessingModel>): Promise<any[]> {
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
  //         let movementSave: any;
  //         // From the customer's point of view the debit is an addition
  //         const operation: number =
  //           input.value.mouvement.type == TypeMovement.debit
  //             ? +input.value.mouvement.valeur
  //             : +input.value.mouvement.valeur * -1;
  //         response.campagne_id = isDefined(input.value.campagne_id)
  //           ? input.value.campagne_id
  //           : response.campagne_id;
  //         response.compte_banque_id = isDefined(input.value.compte_banque_id)
  //           ? input.value.compte_banque_id
  //           : response.compte_banque_id;
  //         response.sous_compte_banque_id = isDefined(
  //           input.value.sous_compte_banque_id,
  //         )
  //           ? input.value.sous_compte_banque_id
  //           : response.sous_compte_banque_id;
  //         response.exportateur_id = isDefined(input.value.exportateur_id)
  //           ? input.value.exportateur_id
  //           : response.exportateur_id;
  //         response.numero = isDefined(input.value.numero)
  //           ? input.value.numero
  //           : response.numero;
  //         response.date_tirage = isDefined(input.value.date_tirage)
  //           ? input.value.date_tirage
  //           : response.date_tirage;
  //         response.type = isDefined(input.value.type)
  //           ? input.value.type
  //           : response.type;
  //         response.updated_by = input.user.name;

  //         // apply movement on account
  //         if (isDefined(input.value.mouvement)) {
  //           // apply movement on account
  //           response.solde = +response.solde + operation;
  //           movementSave = await this.movementAcc.treatment(
  //             this.connection,
  //             input.value.mouvement,
  //             input.user.name,
  //           );
  //         }
  //         result = await this.repository.update({ id: input.param }, response);
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

  // async delete(input: IRmqInput<PledgeProcessingModel>): Promise<any[]> {
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

  // async softDelete(input: IRmqInput<PledgeProcessingModel>): Promise<any[]> {
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
  //           data: response,
  //           params: `Aucun element ne correspont au paramètre id ${input.param}`,
  //         });
  //       }
  //       try {
  //         response.deleted_by = input.user.name;
  //         await this.repository.update({ id: input.param }, response);
  //         result = await this.repository.softDelete({ id: input.param });

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

  // async restore(input: IRmqInput<PledgeProcessingModel>): Promise<any[]> {
  //   let exception: any, result: any;
  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       const response = await this.repository.findOne(input.param, {
  //         withDeleted: true,
  //         where: { deleted_date: Not(IsNull()) },
  //       });
  //       if (!isDefined(response)) {
  //         return responseRequest({
  //           status: 'errorFound',
  //           data: response,
  //           params: `Aucun element ne correspont au paramètre id ${input.param}`,
  //         });
  //       }
  //       try {
  //         response.updated_by = input.user.name;
  //         await this.repository.update({ id: input.param }, response);
  //         result = await this.repository.restore({ id: input.param });

  //         exception = await responseRequest({
  //           status: 'updated',
  //           data: result,
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

  // async findAll(input: IRmqInput<QueryParam>): Promise<any[]> {
  //   let exception: any;
  //   const result = [];

  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       try {
  //         const found = await this.repository.find({
  //           relations: this.relationship,
  //           withDeleted: false,
  //         });

  //         if (isDefined(found)) {
  //           for (const item of found) {
  //             const finalItem = cleanUp(item, clean);
  //             // const exportateur = cleanUp(item.exportateur, clean);
  //             const mainResult = await this.getMainObject(
  //               item.campagne_id,
  //               item.compte.banque_id,
  //             );
  //             // remove movement; account info; sub account info
  //             delete item.sousCompte.mouvement;
  //             delete item.sousCompte.id;
  //             delete item.sousCompte.compte_banque_id;
  //             delete item.sousCompte.solde;
  //             delete item.sousCompte.date;
  //             const subAccount = cleanUp(item.sousCompte, clean);

  //             // remove compte
  //             delete finalItem.compte;
  //             result.push({
  //               ...finalItem,
  //               ...mainResult,
  //               // exportateur: exportateur,
  //               sousCompte: subAccount,
  //             });
  //           }
  //         }
  //         exception = await responseRequest({
  //           status: 'found',
  //           data: result,
  //           params: result.length,
  //         });
  //       } catch (error) {
  //         if (error.code === '22P02') {
  //           exception = await responseRequest({
  //             status: 'errorFound',
  //             data: result,
  //             params: error.message,
  //           });
  //         } else {
  //           exception = await responseRequest({
  //             status: 'errorOtherRequest',
  //             data: error,
  //             params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
  //           });
  //         }
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

  // async findPaginate(input: IRmqInput<QueryParam>): Promise<any[]> {
  //   let exception: any,
  //     result = [];
  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       try {
  //         const [found, total] = await this.repository.findAndCount({
  //           relations: this.relationship,
  //           withDeleted: false,
  //           order: { created_date: input.value.order ?? 'DESC' },
  //           skip: +input.value.offset,
  //           take: +input.value.take,
  //         });

  //         if (isDefined(found)) {
  //           for (const item of found) {
  //             const finalItem = cleanUp(item, clean);
  //             // const exportateur = cleanUp(item.exportateur, clean);
  //             const mainResult = await this.getMainObject(
  //               item.campagne_id,
  //               item.compte.banque_id,
  //             );
  //             // remove movement; account info; sub account info
  //             delete item.sousCompte.mouvement;
  //             delete item.sousCompte.id;
  //             delete item.sousCompte.compte_banque_id;
  //             delete item.sousCompte.solde;
  //             delete item.sousCompte.date;
  //             const subAccount = cleanUp(item.sousCompte, clean);

  //             // remove compte
  //             delete finalItem.compte;
  //             result.push({
  //               ...finalItem,
  //               ...mainResult,
  //               // exportateur: exportateur,
  //               sousCompte: subAccount,
  //             });
  //           }
  //         }
  //         exception = await responseRequest({
  //           status: 'found',
  //           data: result,
  //           params: result.length,
  //         });

  //         // Set Meta Pagination information
  //         exception[0].response.meta = {
  //           itemCount: total,
  //           totalItems: total,
  //           itemsPerPage: +input.value.take,
  //           totalPages: Math.floor(total / +input.value.take),
  //           currentPage: +input.value.offset + 1,
  //         };
  //       } catch (error) {
  //         if (error.code === '22P02') {
  //           exception = await responseRequest({
  //             status: 'errorFound',
  //             data: result,
  //             params: error.message,
  //           });
  //         } else {
  //           exception = await responseRequest({
  //             status: 'errorOtherRequest',
  //             data: error,
  //             params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
  //           });
  //         }
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

  // async findPaginateResearch(input: IRmqInput<QueryParam>): Promise<any[]> {
  //   let exception: any,
  //     result = [];
  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       try {
  //         const [found, total] = await this.repository.findAndCount({
  //           relations: this.relationship,
  //           withDeleted: false,
  //           where: {
  //             numero: Raw(
  //               (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
  //               { value: `%${input.value.query}%` },
  //             ),
  //             exportateur: {
  //               raison: Raw(
  //                 (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
  //                 { value: `%${input.value.query}%` },
  //               ),
  //             },
  //           },
  //           order: { created_date: input.value.order ?? 'DESC' },
  //           skip: +input.value.offset,
  //           take: +input.value.take,
  //         });

  //         if (isDefined(found)) {
  //           for (const item of found) {
  //             const finalItem = cleanUp(item, clean);
  //             // const exportateur = cleanUp(item.exportateur, clean);
  //             const mainResult = await this.getMainObject(
  //               item.campagne_id,
  //               item.compte.banque_id,
  //             );
  //             // remove movement; account info; sub account info
  //             delete item.sousCompte.mouvement;
  //             delete item.sousCompte.id;
  //             delete item.sousCompte.compte_banque_id;
  //             delete item.sousCompte.solde;
  //             delete item.sousCompte.date;
  //             const subAccount = cleanUp(item.sousCompte, clean);

  //             // remove compte
  //             delete finalItem.compte;
  //             result.push({
  //               ...finalItem,
  //               ...mainResult,
  //               // exportateur: exportateur,
  //               sousCompte: subAccount,
  //             });
  //           }
  //         }
  //         exception = await responseRequest({
  //           status: 'found',
  //           data: result,
  //           params: result.length,
  //         });

  //         // Set Meta Pagination information
  //         exception[0].response.meta = {
  //           itemCount: total,
  //           totalItems: total,
  //           itemsPerPage: +input.value.take,
  //           totalPages: Math.floor(total / +input.value.take),
  //           currentPage: +input.value.offset + 1,
  //         };
  //       } catch (error) {
  //         if (error.code === '22P02') {
  //           exception = await responseRequest({
  //             status: 'errorFound',
  //             data: result,
  //             params: error.message,
  //           });
  //         } else {
  //           exception = await responseRequest({
  //             status: 'errorOtherRequest',
  //             data: error,
  //             params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
  //           });
  //         }
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

  // async findDeleted(input: IRmqInput<QueryParam>): Promise<any[]> {
  //   let exception: any,
  //     result = [];
  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       try {
  //         const [found, total] = await this.repository.findAndCount({
  //           relations: this.relationship,
  //           withDeleted: true,
  //           order: { created_date: input.value.order ?? 'DESC' },
  //           skip: +input.value.offset,
  //           take: +input.value.take,
  //         });

  //         if (isDefined(found)) {
  //           for (const item of found) {
  //             const finalItem = cleanUp(item, clean);
  //             // const exportateur = cleanUp(item.exportateur, clean);
  //             const mainResult = await this.getMainObject(
  //               item.campagne_id,
  //               item.compte.banque_id,
  //             );
  //             // remove movement; account info; sub account info
  //             delete item.sousCompte.mouvement;
  //             delete item.sousCompte.id;
  //             delete item.sousCompte.compte_banque_id;
  //             delete item.sousCompte.solde;
  //             delete item.sousCompte.date;
  //             const subAccount = cleanUp(item.sousCompte, clean);

  //             // remove compte
  //             delete finalItem.compte;
  //             result.push({
  //               ...finalItem,
  //               ...mainResult,
  //               // exportateur: exportateur,
  //               sousCompte: subAccount,
  //             });
  //           }
  //         }
  //         exception = await responseRequest({
  //           status: 'found',
  //           data: result,
  //           params: result.length,
  //         });

  //         // Set Meta Pagination information
  //         exception[0].response.meta = {
  //           itemCount: total,
  //           totalItems: total,
  //           itemsPerPage: +input.value.take,
  //           totalPages: Math.floor(total / +input.value.take),
  //           currentPage: +input.value.offset + 1,
  //         };
  //       } catch (error) {
  //         if (error.code === '22P02') {
  //           exception = await responseRequest({
  //             status: 'errorFound',
  //             data: result,
  //             params: error.message,
  //           });
  //         } else {
  //           exception = await responseRequest({
  //             status: 'errorOtherRequest',
  //             data: error,
  //             params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
  //           });
  //         }
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

  // async findById(input: IRmqInput<PledgeProcessingModel>): Promise<any[]> {
  //   let exception: any, result: any;
  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       try {
  //         const found = await this.repository.findOne({
  //           relations: this.relationship,
  //           withDeleted: false,
  //           where: { id: input.param },
  //         });

  //         if (isDefined(found)) {
  //           const finalItem = cleanUp(found, clean);
  //           // const exportateur = cleanUp(found.exportateur, clean);
  //           const mainResult = await this.getMainObject(
  //             found.campagne_id,
  //             found.compte.banque_id,
  //           );
  //           // remove movement; account info; sub account info
  //           delete found.sousCompte.mouvement;
  //           delete found.sousCompte.id;
  //           delete found.sousCompte.compte_banque_id;
  //           delete found.sousCompte.solde;
  //           delete found.sousCompte.date;
  //           const subAccount = cleanUp(found.sousCompte, clean);

  //           // remove compte
  //           delete finalItem.compte;
  //           result = {
  //             ...finalItem,
  //             ...mainResult,
  //             // exportateur: exportateur,
  //             sousCompte: subAccount,
  //           };
  //         }
  //         exception = await responseRequest({
  //           status: 'found',
  //           data: result,
  //           params: Object.keys(result || {}).length,
  //         });
  //       } catch (error) {
  //         if (error.code === '22P02') {
  //           exception = await responseRequest({
  //             status: 'errorFound',
  //             data: result,
  //             params: error.message,
  //           });
  //         } else {
  //           exception = await responseRequest({
  //             status: 'errorOtherRequest',
  //             data: error,
  //             params: `Erreur de paramètre url ${JSON.stringify(input.param)}`,
  //           });
  //         }
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

  // async findCompletion(input: IRmqInput<QueryParam>): Promise<any[]> {
  //   let exception: any,
  //     result = [];
  //   if (this.connectionOk) {
  //     const userExist = await this.verifUser.checkExistingUser(
  //       this.connection,
  //       input.user,
  //     );
  //     if (userExist) {
  //       try {
  //         const [found, total] = await this.repository.findAndCount({
  //           select: ['id', 'numero'],
  //           // relations: ['exportateur'],
  //           withDeleted: false,
  //           where: {
  //             numero: Raw(
  //               (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
  //               { value: `%${input.value.query}%` },
  //             ),
  //             exportateur: {
  //               raison: Raw(
  //                 (columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`,
  //                 { value: `%${input.value.query}%` },
  //               ),
  //             },
  //           },
  //           order: { created_date: input.value.order ?? 'DESC' },
  //           skip: +input.value.offset,
  //           take: +input.value.take,
  //         });

  //         if (isDefined(found)) {
  //           result = found;
  //         }
  //         exception = await responseRequest({
  //           status: 'found',
  //           data: result,
  //           params: result.length,
  //         });

  //         // Set Meta Pagination information
  //         exception[0].response.meta = {
  //           itemCount: total,
  //           totalItems: total,
  //           itemsPerPage: +input.value.take,
  //           totalPages: Math.floor(total / +input.value.take),
  //           currentPage: +input.value.offset + 1,
  //         };
  //       } catch (error) {
  //         if (error.code === '22P02') {
  //           exception = await responseRequest({
  //             status: 'errorFound',
  //             data: result,
  //             params: error.message,
  //           });
  //         } else {
  //           exception = await responseRequest({
  //             status: 'errorOtherRequest',
  //             data: error,
  //             params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
  //           });
  //         }
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

  // async getMainObject(campagne: UUIDVersion, bank: UUIDVersion) {
  //   const object = {};
  //   const campagneResult = await this.mainComponent.campagne(campagne);
  //   const bankResult = await this.mainComponent.banque(bank);
  //   delete campagneResult.detailsCampagne;
  //   Object.assign(object, {
  //     campagne: campagneResult,
  //     banque: bankResult,
  //   });
  //   return object;
  // }
}

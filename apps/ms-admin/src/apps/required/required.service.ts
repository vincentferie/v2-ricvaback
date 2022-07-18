import {
  ContainerType,
  NatureOperation,
  StateBooking,
  StateChargement,
  StateLots,
  StateTirage,
  TypeMovement,
} from '@app/saas-component/helpers/enums';
import { responseRequest } from '@app/saas-component/helpers/core';
import { MainComponentService } from '@app/saas-component/settings/main-component/main-component.service';
import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';

@Injectable()
export class RequiredService {
  private connectionOk = true;

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
    private readonly mainComponent: MainComponentService,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    }
  }

  async findCustomer(input: any): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          result = await this.mainComponent.customer(input.tenant);
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: 1,
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
              params: `Erreur de paramètre url ${JSON.stringify(input.query)}`,
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

  async findCampagne(input: any): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          result = await this.mainComponent.selectCampagne(input.param);
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length || {},
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

  async findBank(input: any): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          result = await this.mainComponent.selectBanque();
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length || {},
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
              params: `Erreur de paramètre url ${JSON.stringify(input.query)}`,
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

  async findBankSpec(input: any): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          result = await this.mainComponent.banqueSepc(input.param);
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length || {},
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

  async findIncotems(input: any): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          result = await this.mainComponent.selectIncotems();
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length || {},
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
              params: `Erreur de paramètre url ${JSON.stringify(input.query)}`,
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

  async findTiersDetenteur(input: any): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          result = await this.mainComponent.selectTierDetenteur();
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length || {},
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
              params: `Erreur de paramètre url ${JSON.stringify(input.query)}`,
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

  async findProvenance(input: any): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          result = await this.mainComponent.selectVille();
          exception = await responseRequest({
            status: 'found',
            data: result,
            params: result.length || {},
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
              params: `Erreur de paramètre url ${JSON.stringify(input.query)}`,
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

  async findEnum(input: any): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          result = {
            statutDechargement: [
              { libelle: 'Refraction', value: StateChargement.refraction },
              { libelle: 'Rejeter', value: StateChargement.rejeter },
              { libelle: 'Valider', value: StateChargement.valider },
            ],
            statutTirage: [
              { libelle: 'Subvention', value: StateTirage.subvention },
              { libelle: 'Rapatriement', value: StateTirage.rapatriement },
              { libelle: 'Nantissement', value: StateTirage.nantissement },
              { libelle: 'Decouvert', value: StateTirage.decouvert },
              { libelle: 'Autres', value: StateTirage.autres },
            ],
            typeConteneur: [
              { libelle: 'Quarante pieds', value: ContainerType.quarantePied },
              { libelle: 'Vingt pieds', value: ContainerType.vingtPied },
            ],
            statutBooking: [
              { libelle: 'Encours', value: StateBooking.encours },
              { libelle: 'Terminer', value: StateBooking.terminer },
            ],
            statutLots: [
              { libelle: 'Denantis', value: StateLots.denantis },
              { libelle: 'Nantis', value: StateLots.nantis },
              { libelle: 'Relacher', value: StateLots.relacher },
            ],
            typeMouvement: [
              { libelle: 'Crédit', value: TypeMovement.credit },
              { libelle: 'Débit', value: TypeMovement.debit },
            ],
            natureOperation: [
              { libelle: 'Approvisionnement', value: NatureOperation.appro },
              {
                libelle: 'Règlement Client',
                value: NatureOperation.regleClient,
              },
              { libelle: 'Nivellement', value: NatureOperation.nivellement },
              { libelle: 'Achat Cajou', value: NatureOperation.achatCajou },
              { libelle: 'Valorisation', value: NatureOperation.valorisation },
              { libelle: 'DUS', value: NatureOperation.dus },
              { libelle: 'Mise à FOB', value: NatureOperation.miseAfob },
              { libelle: 'Magasinage', value: NatureOperation.magasinage },
              {
                libelle: 'Magasinage & Manutention',
                value: NatureOperation.magManu,
              },
              { libelle: 'Manutention', value: NatureOperation.manutention },
              {
                libelle: 'Tierce Detention',
                value: NatureOperation.tierceDetention,
              },
              { libelle: 'Charge Vietnam', value: NatureOperation.chargeViet },
              { libelle: 'ARECA', value: NatureOperation.areca },
              { libelle: 'FRET', value: NatureOperation.fret },
              {
                libelle: 'Charge de Fonctionnement',
                value: NatureOperation.chargeFonct,
              },
              {
                libelle: 'Charge Financière',
                value: NatureOperation.chargeFin,
              },
              {
                libelle: 'Perte de change',
                value: NatureOperation.perteChange,
              },
              { libelle: 'Gain de change', value: NatureOperation.gainChange },
              { libelle: 'Nantissement', value: NatureOperation.nantissement },
            ],
          };
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
              params: `Erreur de paramètre url ${JSON.stringify(input.query)}`,
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

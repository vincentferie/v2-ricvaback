import { StateLots } from '@app/saas-component/helpers/enums';
import { responseRequest } from '@app/saas-component/helpers/core';
import { Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { isDefined } from 'class-validator';
import { SpecificityEntity } from '../externe/specificity.entity';
import { ExporterEntity } from '../externe/exporter.entity';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
@Injectable()
export class InventoryService {
  private specificityRepository: Repository<SpecificityEntity>;
  private exportateurRepository: Repository<ExporterEntity>;
  private connectionOk = true;
  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.specificityRepository = connection.getRepository(SpecificityEntity);
      this.exportateurRepository = connection.getRepository(ExporterEntity);
    }
  }

  async etatLotsAnalyseDetailles(input: IRmqInput<QueryParam>): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          // Get lot empote
          const nombreLotEmpote = await this.connection.query(
            `
              SELECT COUNT(*) as nombre
              FROM cashew.lot lots
              INNER JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lots.deleted_by IS NULL
              HAVING ((SUM(lots.sac_en_stock) - SUM(lotEmp.nbr_sacs)) = 0)
              `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          const empotage = await this.connection.query(
            `
              SELECT (SUM(lots.sac_en_stock) - SUM(lotEmp.nbr_sacs)) as restant, SUM(lots.sac_en_stock) as stock, SUM(lots.poids_net) as poids, (SUM(lots.poids_net * ana.out_turn) / SUM(lots.poids_net)) as outturn
              FROM cashew.lot lots
              INNER JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lotEmp.lot_id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lots.deleted_by IS NULL
              HAVING ((SUM(lots.sac_en_stock) - SUM(lotEmp.nbr_sacs)) = 0)
              `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          let objetEmpotage;
          if (
            isDefined(nombreLotEmpote) &&
            nombreLotEmpote.length > 0 &&
            +nombreLotEmpote[0].nombre > 0
          ) {
            objetEmpotage = {
              etat:
                +nombreLotEmpote[0].nombre >= 1
                  ? 'Totalement Empotés'
                  : 'Totalement Empoté',
              nombre: +nombreLotEmpote[0].nombre,
              restant: +empotage[0].restant,
              stock: +empotage[0].stock,
              poids: +empotage[0].poids,
              outturn: +empotage[0].outturn,
            };
          } else {
            objetEmpotage = {
              etat: 'Empoté',
              nombre: 0,
              restant: 0,
              stock: 0,
              poids: 0,
              outturn: 0,
            };
          }

          // Get lot Partiel
          const nombreLotPartiel = await this.connection.query(
            `
              SELECT COUNT(*) as nombre
              FROM cashew.lot lots
              INNER JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lots.deleted_by IS NULL
              HAVING ((SUM(lots.sac_en_stock) - SUM(lotEmp.nbr_sacs)) > 0)
              `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          const partiel = await this.connection.query(
            `
              SELECT (SUM(lots.sac_en_stock) - SUM(lotEmp.nbr_sacs)) as restant, SUM(lots.sac_en_stock) as stock, SUM(lots.poids_net) as poids, (SUM(lots.poids_net * ana.out_turn) / SUM(lots.poids_net)) as outturn
              FROM cashew.lot lots
              INNER JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lots.deleted_by IS NULL
              HAVING ((SUM(lots.sac_en_stock) - SUM(lotEmp.nbr_sacs)) > 0)
              `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          let objetPartiel;
          if (
            isDefined(nombreLotPartiel) &&
            nombreLotPartiel.length > 0 &&
            +nombreLotPartiel[0].nombre > 0
          ) {
            objetPartiel = {
              etat:
                +nombreLotPartiel[0].nombre >= 1
                  ? 'Partiellement Empotés'
                  : 'Partiellement Empoté',
              nombre: +nombreLotPartiel[0].nombre,
              restant: +partiel[0].restant,
              stock: +partiel[0].stock,
              poids: +partiel[0].poids,
              outturn: +partiel[0].outturn,
            };
          } else {
            objetPartiel = {
              etat: 'Empoté Partiellement',
              nombre: 0,
              restant: 0,
              stock: 0,
              poids: 0,
              outturn: 0,
            };
          }

          // Get lot Non Empote
          const nombreLotStock = await this.connection.query(
            `
              SELECT COUNT(*) as nombre
              FROM cashew.lot lots
              LEFT JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lotEmp.lot_id IS NULL
              AND lots.deleted_by IS NULL
              `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          const stock = await this.connection.query(
            `
              SELECT SUM(lots.sac_en_stock) as stock, SUM(lots.poids_net) as poids, (SUM(lots.poids_net * ana.out_turn) / SUM(lots.poids_net)) as outturn
              FROM cashew.lot lots
              LEFT JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lotEmp.lot_id IS NULL
              AND lots.deleted_by IS NULL
              `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          let objetStock;
          if (
            isDefined(nombreLotStock) &&
            nombreLotStock.length > 0 &&
            +nombreLotStock[0].nombre > 0
          ) {
            objetStock = {
              etat:
                +nombreLotStock[0].nombre >= 1 ? 'Non Empotés' : 'Non Empoté',
              nombre: +nombreLotStock[0].nombre,
              restant: 0,
              stock: +stock[0].stock,
              poids: +stock[0].poids,
              outturn: +stock[0].outturn,
            };
          } else {
            objetStock = {
              etat: 'Non Empoté',
              nombre: 0,
              restant: 0,
              stock: 0,
              poids: 0,
              outturn: 0,
            };
          }

          result = [objetEmpotage, objetPartiel, objetStock];
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

  async etatLotsAnalyseGenerale(input: IRmqInput<QueryParam>): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          // Get lot empote
          const nombreLotEmpote = await this.connection.query(
            `
              SELECT COUNT(*) as nombre
              FROM cashew.lot lots
              INNER JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lots.deleted_by IS NULL
          `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          const empotage = await this.connection.query(
            `
              SELECT (SUM(lots.sac_en_stock) - SUM(lotEmp.nbr_sacs)) as restant, SUM(lots.sac_en_stock) as stock, SUM(lots.poids_net) as poids, (SUM(lots.poids_net * ana.out_turn) / SUM(lots.poids_net)) as outturn
              FROM cashew.lot lots
              INNER JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lotEmp.lot_id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lots.deleted_by IS NULL
          `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          let objetEmpotage;
          if (
            isDefined(nombreLotEmpote) &&
            nombreLotEmpote.length > 0 &&
            +nombreLotEmpote[0].nombre > 0
          ) {
            objetEmpotage = {
              etat:
                +nombreLotEmpote[0].nombre >= 1
                  ? 'Totalement Empotés'
                  : 'Totalement Empoté',
              nombre: +nombreLotEmpote[0].nombre,
              restant: +empotage[0].restant,
              stock: +empotage[0].stock,
              poids: +empotage[0].poids,
              outturn: +empotage[0].outturn,
            };
          } else {
            objetEmpotage = {
              etat: 'Empoté',
              nombre: 0,
              restant: 0,
              stock: 0,
              poids: 0,
              outturn: 0,
            };
          }

          // Get lot Non Empote
          const nombreLotStock = await this.connection.query(
            `
              SELECT COUNT(*) as nombre
              FROM cashew.lot lots
              LEFT JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lots.deleted_by IS NULL
              AND lotEmp.lot_id IS NULL
          `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          const stock = await this.connection.query(
            `
              SELECT SUM(lots.sac_en_stock) as stock, SUM(lots.poids_net) as poids, (SUM(lots.poids_net * ana.out_turn) / SUM(lots.poids_net)) as outturn
              FROM cashew.lot lots
              LEFT JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lots.deleted_by IS NULL
              AND lotEmp.lot_id IS NULL
          `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          let objetStock;
          if (
            isDefined(nombreLotStock) &&
            nombreLotStock.length > 0 &&
            +nombreLotStock[0].nombre > 0
          ) {
            objetStock = {
              etat:
                +nombreLotStock[0].nombre >= 1 ? 'Non Empotés' : 'Non Empoté',
              nombre: +nombreLotStock[0].nombre,
              restant: 0,
              stock: +stock[0].stock,
              poids: +stock[0].poids,
              outturn: +stock[0].outturn,
            };
          } else {
            objetStock = {
              etat: 'Non Empoté',
              nombre: 0,
              restant: 0,
              stock: 0,
              poids: 0,
              outturn: 0,
            };
          }

          result = [objetEmpotage, objetStock];
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

  async etatLotsAnalyseNantis(input: IRmqInput<QueryParam>): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          // Get lot nanti
          const nombreLotNantis = await this.connection.query(
            `
              SELECT COUNT(*) as nombre
              FROM cashew.lot lots
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.statut = $3::cashew.lot_statut_enum
              AND lots.validity = $4::boolean
              AND lots.deleted_by IS NULL
              `,
            [
              input.value.filter_id,
              input.value.filter_two_id,
              StateLots.nantis,
              true,
            ],
          );
          const nantis = await this.connection.query(
            `
              SELECT SUM(lots.sac_en_stock) as stock, SUM(lots.poids_net) as poids, (SUM(lots.poids_net * ana.out_turn) / SUM(lots.poids_net)) as outturn
              FROM cashew.lot lots
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.statut = $3::cashew.lot_statut_enum
              AND lots.validity = $4::boolean
              AND lots.deleted_by IS NULL
              `,
            [
              input.value.filter_id,
              input.value.filter_two_id,
              StateLots.nantis,
              true,
            ],
          );
          let objetNantis;
          if (isDefined(nombreLotNantis) && nombreLotNantis.length > 0) {
            objetNantis = {
              etat: +nombreLotNantis[0].nombre >= 1 ? 'Nantis' : 'Nanti',
              nombre: +nombreLotNantis[0].nombre,
              stock: +nantis[0].stock,
              poids: +nantis[0].poids,
              outturn: +nantis[0].outturn,
            };
          } else {
            objetNantis = {
              etat: 'Nanti',
              nombre: 0,
              restant: 0,
              stock: 0,
              poids: 0,
              outturn: 0,
            };
          }

          // Get lots non nanti ou relache
          const nombreLotOther = await this.connection.query(
            `
              SELECT COUNT(*) as nombre
              FROM cashew.lot lots
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.statut IN ($3, $4::cashew.lot_statut_enum, $5::cashew.lot_statut_enum)
              AND lots.validity = $6::boolean
              AND lots.deleted_by IS NULL
              `,
            [
              input.value.filter_id,
              input.value.filter_two_id,
              null,
              StateLots.denantis,
              StateLots.relacher,
              true,
            ],
          );
          const other = await this.connection.query(
            `
              SELECT SUM(lots.sac_en_stock) as stock, SUM(lots.poids_net) as poids, (SUM(lots.poids_net * ana.out_turn) / SUM(lots.poids_net)) as outturn
              FROM cashew.lot lots
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.statut IN ($3, $4::cashew.lot_statut_enum, $5::cashew.lot_statut_enum)
              AND lots.validity = $6::boolean
              AND lots.deleted_by IS NULL
              `,
            [
              input.value.filter_id,
              input.value.filter_two_id,
              null,
              StateLots.denantis,
              StateLots.relacher,
              true,
            ],
          );
          let objetOther;
          if (isDefined(nombreLotOther) && nombreLotOther.length > 0) {
            objetOther = {
              etat:
                +nombreLotOther[0].nombre >= 1
                  ? 'Non Nanti, Denanti ou relaché'
                  : 'Non Nantis / Denantis / Relachés',
              nombre: +nombreLotOther[0].nombre,
              stock: +other[0].stock,
              poids: +other[0].poids,
              outturn: +other[0].outturn,
            };
          } else {
            objetOther = {
              etat: 'Non Nantis / Denantis / Relachés',
              nombre: 0,
              restant: 0,
              stock: 0,
              poids: 0,
              outturn: 0,
            };
          }

          result = [objetNantis, objetOther];
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

  async etatStatutLotsAnalyse(input: IRmqInput<QueryParam>): Promise<any[]> {
    let result = [],
      exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const specificity = await this.specificityRepository.find({
            withDeleted: false,
          });
          if (isDefined(specificity) && specificity.length > 0) {
            for (const item of specificity) {
              // Get lot
              const nombreLotStatut = await this.connection.query(
                `
                  SELECT COUNT(*) as nombre
                  FROM cashew.lot lot
                  INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lot.id
                  INNER JOIN cashew.specificite spec ON spec.id = lot.specificity_id
                  WHERE lot.campagne_id = $1::uuid
                  AND lot.entrepot_id = $2::uuid
                  AND lot.specificity_id = $3::uuid
                  AND lot.validity = $4::boolean
                  AND lot.deleted_by IS NULL
                  `,
                [
                  input.value.filter_id,
                  input.value.filter_two_id,
                  item.id,
                  true,
                ],
              );
              const statut = await this.connection.query(
                `
                  SELECT SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                  FROM cashew.lot lot
                  INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lot.id
                  INNER JOIN cashew.specificite spec ON spec.id = lot.specificity_id
                  WHERE lot.campagne_id = $1::uuid
                  AND lot.entrepot_id = $2::uuid
                  AND lot.specificity_id = $3::uuid
                  AND lot.validity = $4::boolean
                  AND lot.deleted_by IS NULL
                  `,
                [
                  input.value.filter_id,
                  input.value.filter_two_id,
                  item.id,
                  true,
                ],
              );
              if (isDefined(nombreLotStatut) && nombreLotStatut.length > 0) {
                result.push({
                  libelle: item.libelle,
                  nombre: +nombreLotStatut[0].nombre,
                  stock: +statut[0].stock,
                  poids: +statut[0].poids,
                  outturn: +statut[0].outturn,
                });
              } else {
                result.push({
                  libelle: item.libelle,
                  nombre: 0,
                  restant: 0,
                  stock: 0,
                  poids: 0,
                  outturn: 0,
                });
              }
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

  async etatLotsAnalyseExportateur(
    input: IRmqInput<QueryParam>,
  ): Promise<any[]> {
    let result = [],
      exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const exportateur = await this.exportateurRepository.find({
            withDeleted: false,
          });
          if (isDefined(exportateur) && exportateur.length > 0) {
            for (const item of exportateur) {
              // Get lot empote
              const nombreLotEmpote = await this.connection.query(
                `
                  SELECT COUNT(*) as nombre
                  FROM cashew.lot lot
                  INNER JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lot.id
                  INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lot.id
                  WHERE lot.campagne_id = $1::uuid
                  AND lot.entrepot_id = $2::uuid
                  AND lot.exportateur_id = $3::uuid
                  AND lot.validity = $4::boolean
                  AND lot.deleted_by IS NULL
                  `,
                [
                  input.value.filter_id,
                  input.value.filter_two_id,
                  item.id,
                  true,
                ],
              );
              const empotage = await this.connection.query(
                `
                  SELECT (SUM(lot.sac_en_stock) - SUM(lotEmp.nbr_sacs)) as restant, SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                  FROM cashew.lot lot
                  INNER JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lot.id
                  INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lotEmp.lot_id
                  WHERE lot.campagne_id = $1::uuid
                  AND lot.entrepot_id = $2::uuid
                  AND lot.exportateur_id = $3::uuid
                  AND lot.validity = $4::boolean
                  AND lot.deleted_by IS NULL
                  `,
                [
                  input.value.filter_id,
                  input.value.filter_two_id,
                  item.id,
                  true,
                ],
              );
              if (
                isDefined(nombreLotEmpote) &&
                nombreLotEmpote.length > 0 &&
                +nombreLotEmpote[0].nombre > 0
              ) {
                result.push({
                  exportateur: item.raison,
                  nombre: +nombreLotEmpote[0].nombre,
                  restant: +empotage[0].restant,
                  stock: +empotage[0].stock,
                  poids: +empotage[0].poids,
                  outturn: +empotage[0].outturn,
                });
              } else {
                result.push({
                  exportateur: item.raison,
                  nombre: 0,
                  restant: 0,
                  stock: 0,
                  poids: 0,
                  outturn: 0,
                });
              }
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

  async inventaireLotsExportateur(
    input: IRmqInput<QueryParam>,
  ): Promise<any[]> {
    let result = [],
      exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const queryResult = await this.connection.query(
            `
              SELECT exp.raison, spec.libelle, lots.numero_ticket_pese, lots.code_dechargement, 
                      lots.numero_lot, lots.date_dechargement, (lots.sac_en_stock - lotEmp.nbr_sacs) as restant, lots.sac_en_stock as stock, 
                      lots.poids_net as poids, ((lots.poids_net * ana.out_turn) / lots.poids_net) as outturn
              FROM cashew.lot lots
              INNER JOIN cashew.detail_execution_empotage lotEmp ON lotEmp.lot_id = lots.id
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lotEmp.lot_id
              INNER JOIN cashew.specificite spec ON spec.id = lots.specificity_id
              INNER JOIN cashew.exportateur exp ON exp.id = lots.exportateur_id
              WHERE lots.campagne_id = $1::uuid
              AND lots.entrepot_id = $2::uuid
              AND lots.validity = $3::boolean
              AND lots.deleted_by IS NULL
              `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          if (isDefined(queryResult) && queryResult.length > 0) {
            for (const item of queryResult) {
              result.push({
                exportateur: item.raison,
                type: item.libelle,
                numeroLot: item.numero_lot,
                numeroTicket: item.numero_ticket_pese,
                codeDech: item.code_dechargement,
                restant: +item.restant,
                stock: +item.stock,
                poids: +item.poids,
                outturn: +item.outturn,
                date: item.date_dechargement,
                etat:
                  +item.restant == 0
                    ? 'Empotés'
                    : 'Partiellement Empotés ou non',
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
}

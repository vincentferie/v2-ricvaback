import { StateLots } from '@app/saas-component/helpers/enums';
import { responseRequest } from '@app/saas-component/helpers/core';
import { Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { isDefined } from 'class-validator';
import { SpecificityEntity } from '../externe/specificity.entity';
import { ExporterEntity } from '../externe/exporter.entity';
import {
  IRmqInput,
  QueryParam,
} from '@app/saas-component/helpers/interfaces';
import { WarehousesEntity } from '../externe/warehouses.entity';
import { CampagneOutturnEntity } from '../externe/outturn.entity';
import { AnalysesEntity } from '../externe/analyse.entity';
@Injectable()
export class ReportExporterService {
  private entrepotRepository: Repository<WarehousesEntity>;
  private campagneOutturnRepository: Repository<CampagneOutturnEntity>;
  private analyseRepository: Repository<AnalysesEntity>;
  private connectionOk = true;
  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.entrepotRepository = connection.getRepository(WarehousesEntity);
      this.campagneOutturnRepository = connection.getRepository(
        CampagneOutturnEntity,
      );
    }
  }

  async repartitionLotTonnageSite(
    input: IRmqInput<QueryParam>,
  ): Promise<any[]> {
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const entrepot = await this.entrepotRepository.find({
            withDeleted: false,
          });

          if (isDefined(entrepot) && entrepot.length > 0) {
            const analyseResult = [];
            const nonAnalyseResult = [];
            let nbrTA = 0,
              nbrTN = 0,
              poidsTA = 0,
              poidsTN = 0;
            for (const item of entrepot) {
              // Get lot Analyse
              const nombreLotAnalyse = await this.connection.query(
                `
                  SELECT COUNT(*) as nombre
                  FROM cashew.lot lots
                  INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
                  WHERE lots.campagne_id = $1::uuid
                  AND lots.entrepot_id = $2::uuid
                  AND lots.exportateur_id = $3::uuid
                  AND lots.validity = $4::boolean
                  AND lots.deleted_by IS NULL
                  `,
                [
                  input.value.filter_id,
                  item.id,
                  input.value.filter_two_id,
                  true,
                ],
              );

              const analyse = await this.connection.query(
                `
                  SELECT SUM(lots.poids_net) as poids
                  FROM cashew.lot lots
                  INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
                  WHERE lots.campagne_id = $1::uuid
                  AND lots.entrepot_id = $2::uuid
                  AND lots.exportateur_id = $3::uuid
                  AND lots.validity = $4::boolean
                  AND lots.deleted_by IS NULL
                  GROUP BY lots.entrepot_id
                  `,
                [
                  input.value.filter_id,
                  item.id,
                  input.value.filter_two_id,
                  true,
                ],
              );

              if (
                isDefined(nombreLotAnalyse) &&
                nombreLotAnalyse.length > 0 &&
                +nombreLotAnalyse[0].nombre > 0
              ) {
                analyseResult.push({
                  site: item.libelle,
                  nombre: +nombreLotAnalyse[0].nombre,
                  poids: +analyse[0].poids,
                });
                nbrTA = nbrTA + +nombreLotAnalyse[0].nombre;
                poidsTA = poidsTA + +analyse[0].poids;
              }

              // Get lot Non Analyse
              const nombreLotNonAnalyse = await this.connection.query(
                `
                  SELECT COUNT(*) as nombre
                  FROM cashew.lot lots
                  LEFT JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
                  WHERE lots.campagne_id = $1::uuid
                  AND lots.entrepot_id = $2::uuid
                  AND lots.exportateur_id = $3::uuid
                  AND lots.validity = $4::boolean
                  AND lots.deleted_by IS NULL
                  AND ana.lot_id IS NULL
                  `,
                [
                  input.value.filter_id,
                  item.id,
                  input.value.filter_two_id,
                  true,
                ],
              );

              const nonAnalyse = await this.connection.query(
                `
                  SELECT SUM(lots.poids_net) as poids
                  FROM cashew.lot lots
                  LEFT JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
                  WHERE lots.campagne_id = $1::uuid
                  AND lots.entrepot_id = $2::uuid
                  AND lots.exportateur_id = $3::uuid
                  AND lots.validity = $4::boolean
                  AND lots.deleted_by IS NULL
                  AND ana.lot_id IS NULL
                  GROUP BY lots.entrepot_id
                  `,
                [
                  input.value.filter_id,
                  item.id,
                  input.value.filter_two_id,
                  true,
                ],
              );
              if (
                isDefined(nombreLotNonAnalyse) &&
                nombreLotNonAnalyse.length > 0 &&
                +nombreLotNonAnalyse[0].nombre > 0
              ) {
                nonAnalyseResult.push({
                  site: item.libelle,
                  nombre: +nombreLotNonAnalyse[0].nombre,
                  poids: +nonAnalyse[0].poids,
                });
                nbrTN = nbrTN + +nombreLotNonAnalyse[0].nombre;
                poidsTN = poidsTN + +nonAnalyse[0].poids;
              }
            }
            result = {
              analyse: {
                details: analyseResult,
                totalNbreLot: nbrTA,
                tonnageTotal: poidsTA,
              },
              nonAnalyse: {
                details: nonAnalyseResult,
                totalNbreLot: nbrTN,
                tonnageTotal: poidsTN,
              },
            };
          }
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

  async qualiteProduitsAnalyses(
    input: IRmqInput<QueryParam>,
  ): Promise<any[]> {
    let result: any,
      exception: any,
      poidsOutturnMin: any,
      poidsOutturnMax: any,
      poidsOutturnMiddle: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const outturn = await this.campagneOutturnRepository.findOne({
            where: {
              campagne_id: input.value.filter_id,
              flag: input.value.flag,
            },
            withDeleted: false,
          });
          if (isDefined(outturn)) {
            poidsOutturnMin = await this.connection.query(
              `
              SELECT SUM(lots.poids_net) as poids
              FROM cashew.lot lots
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.exportateur_id = $2::uuid
              AND ana.out_turn < $3::float
              AND lots.validity = $4::boolean
              AND lots.deleted_by IS NULL
              `,
              [
                input.value.filter_id,
                input.value.filter_two_id,
                +outturn.min_outturn,
                true,
              ],
            );

            poidsOutturnMax = await this.connection.query(
              `
              SELECT SUM(lots.poids_net) as poids
              FROM cashew.lot lots
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.exportateur_id = $2::uuid
              AND ana.out_turn > $3::float
              AND lots.validity = $4::boolean
              AND lots.deleted_by IS NULL
              `,
              [
                input.value.filter_id,
                input.value.filter_two_id,
                +outturn.max_outturn,
                true,
              ],
            );
            poidsOutturnMiddle = await this.connection.query(
              `
              SELECT SUM(lots.poids_net) as poids
              FROM cashew.lot lots
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.exportateur_id = $2::uuid
              AND ana.out_turn BETWEEN $3::float AND $4::float
              AND lots.validity = $5::boolean
              AND lots.deleted_by IS NULL
              `,
              [
                input.value.filter_id,
                input.value.filter_two_id,
                +outturn.min_outturn,
                +outturn.max_outturn,
                true,
              ],
            );
          }
          result = {
            outturnInferior: {
              text: `Outturn inférieur à ${
                isDefined(outturn) ? +outturn.min_outturn : '-'
              }`,
              poids: isDefined(poidsOutturnMin)
                ? +poidsOutturnMin[0].poids
                : null,
            },
            outturnSuperior: {
              text: `Outturn supérieur à ${
                isDefined(outturn) ? +outturn.max_outturn : '-'
              }`,
              poids: isDefined(poidsOutturnMax)
                ? +poidsOutturnMax[0].poids
                : null,
            },
            outturnBetween: {
              text: `Outturn entre ${
                isDefined(outturn) ? +outturn.min_outturn : '-'
              } et ${isDefined(outturn) ? +outturn.max_outturn : '-'}`,
              poids: isDefined(poidsOutturnMiddle)
                ? +poidsOutturnMiddle[0].poids
                : null,
            },
          };
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

  async repartitionLots(input: IRmqInput<QueryParam>): Promise<any[]> {
    let exception: any, result: any, analyseResult: any, nonAnalyseResult;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const analyse = await this.connection.query(
            `
            SELECT SUM(lots.poids_net) as poids
            FROM cashew.lot lots
            INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
            WHERE lots.campagne_id = $1::uuid
            AND lots.exportateur_id = $2::uuid
            AND lots.validity = $3::boolean
            AND lots.deleted_by IS NULL
            GROUP BY lots.entrepot_id
          `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );

          analyseResult = {
            libelle: 'Lots analysés',
            poids:
              isDefined(analyse) && analyse.length > 0 ? +analyse[0].poids : 0,
          };

          const nonAnalyse = await this.connection.query(
            `
            SELECT SUM(lots.poids_net) as poids
            FROM cashew.lot lots
            LEFT JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
            WHERE ana.lot_id IS NULL
            AND lots.campagne_id = $1::uuid
            AND lots.exportateur_id = $2::uuid
            AND lots.validity = $3::boolean
            AND lots.deleted_by IS NULL
            `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );

          nonAnalyseResult = {
            libelle: 'Lots non analysés',
            poids:
              isDefined(nonAnalyse) && nonAnalyse.length > 0
                ? +nonAnalyse[0].poids
                : 0,
          };

          result = { nonAnalyse: nonAnalyseResult, analyse: analyseResult };

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
          SELECT lots.id, zone.libelle as specificite, entr.libelle as entrepot, chrg.tracteur, chrg.remorque, 
                  lots.numero_ticket_pese, lots.code_dechargement, 
                  lots.numero_lot, lots.date_dechargement, lots.poids_net
          FROM cashew.lot lots
          INNER JOIN cashew.specificite zone ON zone.id = lots.specificity_id
          INNER JOIN cashew.dechargement chrg ON chrg.id = lots.dechargement_id
          INNER JOIN cashew.entrepot entr ON entr.id = lots.entrepot_id
          WHERE lots.campagne_id = $1::uuid
          AND lots.exportateur_id = $2::uuid
          AND lots.validity = $3::boolean
          AND lots.deleted_by IS NULL
          `,
            [input.value.filter_id, input.value.filter_two_id, true],
          );
          if (isDefined(queryResult) && queryResult.length > 0) {
            for (const item of queryResult) {
              const outturn = await this.analyseRepository.findOne({
                lot_id: item.id,
              });

              result.push({
                entrepot: item.entrepot,
                type: item.specificite,
                camion: item.tracteur,
                remorque: item.remorque,
                numeroLot: item.numero_lot,
                numeroTicket: item.numero_ticket_pese,
                codeDech: item.code_dechargement,
                poids: +item.poids_net,
                outturn: isDefined(outturn) ? outturn.out_turn : null,
                date: item.date_dechargement,
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

import { responseRequest } from '@app/saas-component/helpers/core';
import { Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { isDefined } from 'class-validator';
import { IRmqInput, QueryParam } from '@app/saas-component/helpers/interfaces';
import { SiteEntity } from '../externe/site.entity';
import { WarehousesEntity } from '../externe/warehouses.entity';
import { CampagneOutturnEntity } from '../externe/outturn.entity';
import { ExporterEntity } from '../externe/exporter.entity';
@Injectable()
export class ReportGeneralService {
  private siteRepository: Repository<SiteEntity>;
  private entrepotRepository: Repository<WarehousesEntity>;
  private campagneOutturnRepository: Repository<CampagneOutturnEntity>;
  private exporterRepository: Repository<ExporterEntity>;
  private connectionOk = true;
  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly verifUser: VerifUser,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.siteRepository = connection.getRepository(SiteEntity);
      this.entrepotRepository = connection.getRepository(WarehousesEntity);
      this.campagneOutturnRepository = connection.getRepository(
        CampagneOutturnEntity,
      );
      this.exporterRepository = connection.getRepository(ExporterEntity);
    }
  }

  async repartitionLotTonnageSiteVille(
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
          const site = await this.siteRepository.find({ withDeleted: false });
          let totalNombre = 0,
            totalPoids = 0;
          const details = [];
          if (isDefined(site) && site.length > 0) {
            for (const item of site) {
              const repartition = [];
              let subTotalNombre = 0,
                subTotalPoids = 0;

              // get entrepot
              const entrepot = await this.entrepotRepository.find({
                site_id: item.id,
              });
              if (isDefined(entrepot) && entrepot.length > 0) {
                for (const value of entrepot) {
                  // Get lots
                  const nombreLot = await this.connection.query(
                    `
                      SELECT COUNT(*) as nombre
                      FROM cashew.lot lots
                      WHERE lots.campagne_id = $1::uuid
                      AND lots.entrepot_id = $2::uuid
                      AND lots.validity = $3::boolean
                      AND lots.deleted_by IS NULL
                      `,
                    [input.value.filter_id, value.id, true],
                  );

                  const tonnage = await this.connection.query(
                    `
                      SELECT SUM(lots.poids_net) as poids
                      FROM cashew.lot lots
                      WHERE lots.campagne_id = $1::uuid
                      AND lots.entrepot_id = $2::uuid
                      AND lots.validity = $3::boolean
                      AND lots.deleted_by IS NULL
                      GROUP BY lots.entrepot_id
                      `,
                    [input.value.filter_id, value.id, true],
                  );

                  repartition.push({
                    entrepot: value.libelle,
                    nombreLot:
                      isDefined(nombreLot) && nombreLot.length > 0
                        ? +nombreLot[0].nombre
                        : 0,
                    poidsTotal:
                      isDefined(tonnage) && tonnage.length > 0
                        ? +tonnage[0].poids
                        : 0,
                  });
                  // Section
                  subTotalNombre =
                    subTotalNombre +
                    (isDefined(nombreLot) && nombreLot.length > 0
                      ? +nombreLot[0].nombre
                      : 0);
                  subTotalPoids =
                    subTotalPoids +
                    (isDefined(tonnage) && tonnage.length > 0
                      ? +tonnage[0].poids
                      : 0);
                  // All
                  totalNombre =
                    totalNombre +
                    (isDefined(nombreLot) && nombreLot.length > 0
                      ? +nombreLot[0].nombre
                      : 0);
                  totalPoids =
                    totalPoids +
                    (isDefined(tonnage) && tonnage.length > 0
                      ? +tonnage[0].poids
                      : 0);
                }
              }
              details.push({
                site: item.libelle,
                repartition: repartition,
                totalNbr: subTotalNombre,
                totalPoids: subTotalPoids,
              });
            }
          }
          result = {
            details: details,
            total: { nbrTotal: totalNombre, poidsTotal: totalPoids },
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

  async evolutionNiveauStockJournalier(
    input: IRmqInput<QueryParam>,
  ): Promise<any[]> {
    let exception: any, result;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          let variationData = [],
            poids = 0,
            evolutionData = [];
          const tonnage = await this.connection.query(
            `
              SELECT lots.date_dechargement, SUM(lots.poids_net) as poids
              FROM cashew.lot lots
              WHERE lots.campagne_id = $1::uuid
              AND lots.validity = $2::boolean
              AND lots.deleted_by IS NULL
              GROUP BY lots.date_dechargement
              `,
            [input.value.filter_id, true],
          );

          if (isDefined(tonnage) && tonnage.length > 0) {
            for (const item of tonnage) {
              poids = poids + +item.poids;

              variationData.push({
                date: item.date_dechargement,
                poids: +item.poids,
              });
              evolutionData.push({
                date: item.date_dechargement,
                poids: poids,
              });
            }
          }

          result = {
            variationStock: variationData,
            evolutionStock: evolutionData,
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

  async repartitionTonnageFonctionExportateurs(
    input: IRmqInput<QueryParam>,
  ): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const tonnageExportateur = await this.connection.query(
            `
          SELECT exp.raison, SUM(lots.poids_net) as poids
          FROM cashew.lot lots
          INNER JOIN cashew.exportateur exp ON exp.id = lots.exportateur_id
          WHERE lots.campagne_id = $1::uuid
          AND lots.validity = $2::boolean
          AND lots.deleted_by IS NULL
          GROUP BY lots.exportateur_id, exp.raison
          ORDER BY poids DESC
          `,
            [input.value.filter_id, true],
          );

          if (isDefined(tonnageExportateur) && tonnageExportateur.length > 0) {
            for (const item of tonnageExportateur) {
              result.push({
                exportateur: item.raison,
                poids: +item.poids,
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

  async qualiteProduitsAnalyses(input: IRmqInput<QueryParam>): Promise<any[]> {
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
                AND ana.out_turn < $2::float
                AND lots.validity = $3::boolean
                AND lots.deleted_by IS NULL
                `,
              [input.value.filter_id, +outturn.min_outturn, true],
            );
            poidsOutturnMax = await this.connection.query(
              `
                SELECT SUM(lots.poids_net) as poids
                FROM cashew.lot lots
                INNER JOIN cashew.analyse_lot  ana ON ana.lot_id = lots.id
                WHERE lots.campagne_id = $1::uuid
                AND ana.out_turn > $2::float
                AND lots.validity = $3::boolean
                AND lots.deleted_by IS NULL
                `,
              [input.value.filter_id, +outturn.max_outturn, true],
            );
            poidsOutturnMiddle = await this.connection.query(
              `
                SELECT SUM(lots.poids_net) as poids
                FROM cashew.lot lots
                INNER JOIN cashew.analyse_lot  ana ON ana.lot_id = lots.id
                WHERE lots.campagne_id = $1::uuid
                AND ana.out_turn BETWEEN $2::float AND $3::float
                AND lots.validity = $4::boolean
                AND lots.deleted_by IS NULL
                `,
              [
                input.value.filter_id,
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
              poids: isDefined(poidsOutturnMin)
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
    let result: any, exception: any;
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          let analyse, nonAnalyse: any;

          const analyseResult = await this.connection.query(
            `
              SELECT SUM(lots.poids_net) as poids
              FROM cashew.lot lots
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.validity = $2::boolean
              AND lots.deleted_by IS NULL
              `,
            [input.value.filter_id, true],
          );

          if (isDefined(analyseResult) && analyseResult.length > 0) {
            analyse = {
              libelle: 'Lots analysés',
              poids: +analyseResult[0].poids,
            };
          }

          const nonAnalyseResult = await this.connection.query(
            `
              SELECT SUM(lots.poids_net) as poids
              FROM cashew.lot lots
              INNER JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
              WHERE lots.campagne_id = $1::uuid
              AND lots.validity = $2::boolean
              AND lots.deleted_by IS NULL
              AND ana.lot_id IS NULL
              `,
            [input.value.filter_id, true],
          );
          if (isDefined(nonAnalyseResult) && nonAnalyseResult.length > 0) {
            nonAnalyse = {
              libelle: 'Lots non analysés',
              poids: +nonAnalyseResult[0].poids,
            };
          }
          result = { analyse: analyse, nonAnalyse: nonAnalyse };

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

  async repartitionLotsNonAnalyseEntrepot(
    input: IRmqInput<QueryParam>,
  ): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const nonAnalyse = await this.connection.query(
            `
            SELECT entr.libelle, SUM(lots.poids_net) as poids
            FROM cashew.lot lots
            LEFT JOIN cashew.analyse_lot ana ON ana.lot_id = lots.id
            LEFT JOIN cashew.entrepot entr ON entr.id = lots.entrepot_id
            WHERE lots.campagne_id = $1::uuid
            AND lots.validity = $2::boolean
            AND lots.deleted_by IS NULL
            AND ana.lot_id IS NULL
            GROUP BY entr.libelle
          `,
            [input.value.filter_id, true],
          );
          if (isDefined(nonAnalyse) && nonAnalyse.length > 0) {
            for (const item of nonAnalyse) {
              result.push({
                entrepot: item.libelle,
                poids: +item.poids,
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

  async repartitionLotsExportateurEntrepot(
    input: IRmqInput<QueryParam>,
  ): Promise<any[]> {
    let exception: any,
      result = [];
    if (this.connectionOk) {
      const userExist = await this.verifUser.checkExistingUser(
        this.connection,
        input.user,
      );
      if (userExist) {
        try {
          const exportateur = await this.exporterRepository.find({
            select: ['id', 'raison'],
            withDeleted: false,
          });
          if (isDefined(exportateur) && exportateur.length > 0) {
            for (const item of exportateur) {
              const arrayLot = [];
              let nombreTotal = 0,
                poidsTotal = 0;
              // Get lot empote

              const lot = await this.connection.query(
                `
                      SELECT entr.libelle, SUM(lots.poids_net) as poids, COUNT(lots.id) as nombre
                      FROM cashew.lot lots
                      LEFT JOIN cashew.entrepot entr ON entr.id = lots.entrepot_id
                      WHERE lots.campagne_id = $1::uuid
                      AND lots.exportateur_id = $2::uuid
                      AND lots.validity = $3::boolean
                      AND lots.deleted_by IS NULL
                      GROUP BY entr.libelle
                      `,
                [input.value.filter_id, item.id],
              );
              if (isDefined(lot) && lot.length > 0) {
                for (const value of lot) {
                  nombreTotal = nombreTotal + +value.nombre;
                  poidsTotal = poidsTotal + +value.poids;

                  arrayLot.push({
                    entrepot: value.libelle,
                    nbrLot: +value.nombre,
                    poids: +value.poids,
                  });
                }
              }
              result.push({
                exportateur: item.raison,
                nombreTotalLot: nombreTotal,
                poidsTotal: poidsTotal,
                details: arrayLot,
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

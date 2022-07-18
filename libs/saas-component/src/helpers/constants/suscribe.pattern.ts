// Auth
export const authPattern = [
  'post.auth', // 0
  'post.refresh', // 1
  'post.signup', // 2
  'get.id.user', // 3
  'get.setup', // 4
];

// Utilisateur
export const accountsPattern = [
  'post.account', // 0
  'update.account', // 1
  'delete.account', // 2
  'soft.delete.account', // 3
  'patch.restore.account', // 4
  'get.list.account', // 5
  'get.list.paginate.account', // 6
  'get.list.paginate.query.account', // 7
  'get.soft.delete.paginate.query.account', // 8
  'get.existing.account', // 9
  'get.id.account', // 10
];

// Exportateur
export const exporterPattern = [
  'post.exporter', // 0
  'update.exporter', // 1
  'delete.exporter', // 2
  'soft.delete.exporter', // 3
  'patch.restore.exporter', // 4
  'get.list.exporter', // 5
  'get.list.paginate.exporter', // 6
  'get.list.paginate.query.exporter', // 7
  'get.soft.delete.paginate.query.exporter', // 8
  'get.existing.exporter', // 9
  'get.id.exporter', // 10
];

// Required
export const requiredPattern = [
  'get.list.customer', // 0
  'get.list.campagne', // 1
  'get.list.bank', // 2
  'get.list.bank-spec', // 3
  'get.list.incotems', // 4
  'get.list.tier-detenteur', // 5
  'get.list.provenance', // 6
  'get.list.enum', // 7
];

// Rôle
export const rulesPattern = [
  'soft.delete.rules', // 0
  'patch.restore.rules', // 1
  'get.list.rules', // 2
  'get.list.paginate.rules', // 3
  'get.list.paginate.query.rules', // 4
  'get.soft.delete.paginate.query.rules', // 5
  'get.existing.rules', // 6
  'get.id.rules', // 7
];

// Site
export const sitePattern = [
  'post.site', // 0
  'update.site', // 1
  'delete.site', // 2
  'soft.delete.site', // 3
  'patch.restore.site', // 4
  'get.list.site', // 5
  'get.list.paginate.site', // 6
  'get.list.paginate.query.site', // 7
  'get.soft.delete.paginate.query.site', // 8
  'get.existing.site', // 9
  'get.id.site', // 10
];

// Specificite
export const specificitiesPattern = [
  'post.specificity', // 0
  'update.specificity', // 1
  'delete.specificity', // 2
  'soft.delete.specificity', // 3
  'patch.restore.specificity', // 4
  'get.list.specificity', // 5
  'get.list.paginate.specificity', // 6
  'get.list.paginate.query.specificity', // 7
  'get.soft.delete.paginate.query.specificity', // 8
  'get.existing.specificity', // 9
  'get.id.specificity', // 10
];

// Campagne
export const campagnePattern = [
  'post.tenant-campagne', // 0
  'update.tenant-campagne', // 1
  'delete.tenant-campagne', // 2
  'soft.delete.tenant-campagne', // 3
  'patch.restore.tenant-campagne', // 4
  'get.list.tenant-campagne', // 5
  'get.list.paginate.tenant-campagne', // 6
  'get.list.paginate.query.tenant-campagne', // 7
  'get.soft.delete.paginate.query.tenant-campagne', // 8
  'get.existing.tenant-campagne', // 9
  'get.id.tenant-campagne', // 10
  'get.unclosed.tenant-campagne', // 11
];

// Campagne Outturn
export const outturnPattern = [
  'post.outtrun', // 0
  'update.outtrun', // 1
  'delete.outtrun', // 2
  'soft.delete.outtrun', // 3
  'patch.restore.outtrun', // 4
  'get.list.outtrun', // 5
  'get.list.paginate.outtrun', // 6
  'get.list.paginate.query.outtrun', // 7
  'get.soft.delete.paginate.query.outtrun', // 8
  'get.existing.outtrun', // 9
  'get.id.outtrun', // 10
];

// Campagne Tranche
export const tranchePattern = [
  'post.tranche', // 0
  'update.tranche', // 1
  'delete.tranche', // 2
  'soft.delete.tranche', // 3
  'patch.restore.tranche', // 4
  'get.list.tranche', // 5
  'get.list.paginate.tranche', // 6
  'get.list.paginate.query.tranche', // 7
  'get.soft.delete.paginate.query.tranche', // 8
  'get.existing.tranche', // 9
  'get.id.tranche', // 10
];

// Assignement Superviseur Entrepot
export const assignmentsEntrepotPattern = [
  'post.entrepot-assignment', // 0
  'update.entrepot-assignment', // 1
  'delete.entrepot-assignment', // 2
  'soft.delete.entrepot-assignment', // 3
  'patch.restore.entrepot-assignment', // 4
  'get.list.entrepot-assignment', // 5
  'get.list.paginate.entrepot-assignment', // 6
  'get.list.paginate.query.entrepot-assignment', // 7
  'get.soft.delete.paginate.query.entrepot-assignment', // 8
  'get.id.entrepot-assignment', // 9
  'get.id.entrepot-assignment-user', // 10
];

// Assignement Superviseur Site
export const assignmentsSitePattern = [
  'post.site-assignment', // 0
  'update.site-assignment', // 1
  'delete.site-assignment', // 2
  'soft.delete.site-assignment', // 3
  'patch.restore.site-assignment', // 4
  'get.list.site-assignment', // 5
  'get.list.paginate.site-assignment', // 6
  'get.list.paginate.query.site-assignment', // 7
  'get.soft.delete.paginate.query.site-assignment', // 8
  'get.id.site-assignment', // 9
  'get.id.site-assignment-user', // 10
];

// Entrepot
export const warehousesPattern = [
  'post.warehouses', // 0
  'update.warehouses', // 1
  'delete.warehouses', // 2
  'soft.delete.warehouses', // 3
  'patch.restore.warehouses', // 4
  'get.list.warehouses', // 5
  'get.list.paginate.warehouses', // 6
  'get.list.paginate.query.warehouses', // 7
  'get.soft.delete.paginate.query.warehouses', // 8
  'get.existing.warehouses', // 9
  'get.id.warehouses', // 10
  'get.list.by-site', // 10
];

// Document reference
export const documentRefPattern = [
  'post.document', // 0
  'update.document', // 1
  'delete.document', // 2
  'soft.delete.document', // 3
  'patch.restore.document', // 4
  'get.list.document', // 5
  'get.list.paginate.document', // 6
  'get.list.paginate.query.document', // 7
  'get.soft.delete.paginate.query.document', // 8
  'get.existing.document', // 9
  'get.id.document', // 10
];

// Tableau de bord Operation / Supervisor / Finance / Admini...
export const dashboardPattern = [
  // Supervisor
  'get.dashboard.sup', // 0
  // Operation
  'get.dashboard.ops', // 1
  // Fin
  'get.dashboard.fin', // 2
  // Acc
  'get.dashboard.acc', // 3
  // Admin
  'get.dashboard.admin', // 4
];

// Dechargement
export const unloadingPattern = [
  'post.unloading', // 0
  'update.unloading', // 1
  'delete.unloading', // 2
  'soft.delete.unloading', // 3
  'patch.restore.unloading', // 4
  'get.list.unloading', // 5
  'get.list.paginate.unloading', // 6
  'get.list.paginate.query.unloading', // 7
  'get.soft.delete.paginate.query.unloading', // 8
  'get.existing.unloading', // 9
  'get.id.unloading', // 10
  'get.unused.unloading', // 11,
];

// Lot
export const lotsPattern = [
  'post.lots', // 0
  'update.lots', // 1
  'delete.lots', // 2
  'soft.delete.lots', // 3
  'patch.restore.lots', // 4
  'get.list.lots', // 5
  'get.list.paginate.lots', // 6
  'get.list.paginate.query.lots', // 7
  'get.soft.delete.paginate.query.lots', // 8
  'get.existing.lots', // 9
  'get.id.lots', // 10
  'get.unused.lots', // 11,

  // Analyse
  'post.lots.analyse', // 12
  'update.lots.analyse', // 13
  'delete.lots.analyse', // 14

  // Transfert
  'post.lots.transfert', // 15
  'update.lots.transfert', // 16
  'delete.lots.transfert', // 17

  // Cession
  'post.lots.cession', // 18
  'update.lots.cession', // 19
  'delete.lots.cession', // 20

  // Balance
  'post.lots.balance', // 21
  'update.lots.balance', // 22
  'delete.lots.balance', // 23

  // Balayure
  'post.lots.sweep', // 24
  'update.lots.sweep', // 25
  'delete.lots.sweep', // 26

  // Other
  'get.lots.no-pledge', //27
  'get.lots.no-stuffing', //28
  'get.lots.no-analize', //29
  'get.lots.no-transfert', //30
  'get.lots.no-cession', //31
  'get.lots.potting-plan', //33
];

// validation de lot
export const validateLotPattern = [
  'patch.validate.all', // 0,
  'patch.autorize.unloading', // 1,
  'patch.autorize.lots', // 2,
  'get.list.lots', // 3
  'get.list.paginate.lots', // 4
  'get.list.paginate.query.lots', // 5
  'get.existing.lots', // 6
  'get.id.lots', // 7
];

// Plan d'empotage
export const pottingPlanPattern = [
  'post.potting-plan', // 0
  'update.potting-plan', // 1
  'delete.potting-plan', // 2
  'soft.delete.potting-plan', // 3
  'patch.restore.potting-plan', // 4
  'get.list.potting-plan', // 5
  'get.list.paginate.potting-plan', // 6
  'get.list.paginate.query.potting-plan', // 7
  'get.soft.delete.paginate.query.potting-plan', // 8
  'get.existing.potting-plan', // 9
  'get.id.potting-plan', // 10
  'patch.potting-plan.close', // 11
  'get.id.potting-plan.not-closed', // 12
];

// Plan d'execution
export const pottingExecutionPattern = [
  'post.potting-exec', // 0
  'update.potting-exec', // 1
  'delete.potting-exec', // 2
  'soft.delete.potting-exec', // 3
  'patch.restore.potting-exec', // 4
  'get.list.potting-exec', // 5
  'get.list.paginate.potting-exec', // 6
  'get.list.paginate.query.potting-exec', // 7
  'get.soft.delete.paginate.query.potting-exec', // 8
  'get.existing.potting-exec', // 9
  'get.id.potting-exec', // 10
  'get.lots.execution-rest', // 11
];

// Booking
export const bookingPattern = [
  'post.booking', // 0
  'update.booking', // 1
  'delete.booking', // 2
  'soft.delete.booking', // 3
  'patch.restore.booking', // 4
  'get.list.booking', // 5
  'get.list.paginate.booking', // 6
  'get.list.paginate.query.booking', // 7
  'get.soft.delete.paginate.query.booking', // 8
  'get.existing.booking', // 9
  'get.id.booking', // 10
  'get.id.booking.not-closed', // 11
  'patch.booking.closed', // 12
];

// Conteneur
export const containerPattern = [
  'post.container', // 0
  'update.container', // 1
  'delete.container', // 2
  'soft.delete.container', // 3
  'patch.restore.container', // 4
  'get.list.container', // 5
  'get.list.paginate.container', // 6
  'get.list.paginate.query.container', // 7
  'get.soft.delete.paginate.query.container', // 8
  'get.existing.container', // 9
  'get.id.container', // 10
  'get.id.container.booking', // 11
  'get.id.container.no-stuffing', // 12
  'get.id.container.no-plomb', // 13
  'get.id.container.plomb', // 14
  'post.plomb', // 15
  'update.plomb', // 16
  'delete.plomb', // 17
  'get.container.no-executed', // 18
  'get.container.no-bl', // 19
];

// Bill of lading
export const billOfLadingPattern = [
  'post.bill-of-lading', // 0
  'update.bill-of-lading', // 1
  'update.det-bill-of-lading', // 2
  'delete.bill-of-lading', // 3
  'soft.delete.bill-of-lading', // 4
  'patch.restore.bill-of-lading', // 5
  'get.list.bill-of-lading', // 6
  'get.list.paginate.bill-of-lading', // 7
  'get.list.paginate.query.bill-of-lading', // 8
  'get.soft.delete.paginate.query.bill-of-lading', // 9
  'get.existing.bill-of-lading', // 10
  'get.id.bill-of-lading', // 11
];

// Stats Inventaie Superviseur
export const opsStatsPattern = [
  'get.inventory.etat-lots-analyse-detailles', // 0
  'get.inventory.etat-lots-analyse-generale', // 1
  'get.inventory.etat-lots-analyse-nantis', // 2
  'get.inventory.etat-statut-lots-analyse', // 3
  'get.inventory.etat-lots-analyse-exportateur', // 4
  'get.inventory.inventaire-lots-exportateur', // 5
  'get.exporter.repartition-lot-tonnage-site', // 6
  'get.exporter.qualite-produits-analyses', // 7
  'get.exporter.repartition-lots', // 8
  'get.exporter.inventaire-lots-exportateur', // 9
  'get.general.repartition-lot-tonnage-site-ville', // 10
  'get.general.evolution-niveau-stock-journalier', // 11
  'get.general.repartition-tonnage-fonction-exportateurs', // 12
  'get.general.qualite-produits-analyses', // 13
  'get.general.repartition-lots', // 14
  'get.general.repartition-lots-non-analyse-entrepot', // 15
  'get.general.repartition-lots-exportateur-entrepot', // 16
];

// Transitaire
export const forwarderPattern = [
  'post.forwarder', // 0
  'update.forwarder', // 1
  'delete.forwarder', // 2
  'soft.delete.forwarder', // 3
  'patch.restore.forwarder', // 4
  'get.list.forwarder', // 5
  'get.list.paginate.forwarder', // 6
  'get.list.paginate.query.forwarder', // 7
  'get.soft.delete.paginate.query.forwarder', // 8
  'get.existing.forwarder', // 9
  'get.id.forwarder', // 10
];

// Signal Lot
export const otherPattern = [
  'post.signal.unloading', // 0
  'post.signal.lots', // 1,
];

// Compte Bancaire
export const bankAccountPattern = [
  'post.bank-account', // 0
  'update.bank-account', // 1
  'delete.bank-account', // 2
  'post.sub-account', // 3
  'update.sub-account', // 4
  'delete.sub-account', // 5
  'soft.delete.bank-account', // 6
  'patch.restore.bank-account', // 7
  'get.list.bank-account', // 8
  'get.list.paginate.bank-account', // 9
  'get.list.paginate.query.bank-account', // 10
  'get.soft.delete.paginate.query.bank-account', // 11
  'get.id.bank-account', // 12
];

// Pre-financing
export const preFinancingPattern = [
  'post.pre-financing', // 0
  'update.pre-financing', // 1
  'delete.pre-financing', // 2
  'soft.delete.pre-financing', // 3
  'patch.restore.pre-financing', // 4
  'get.list.pre-financing', // 5
  'get.list.paginate.pre-financing', // 6
  'get.list.paginate.query.pre-financing', // 7
  'get.soft.delete.paginate.query.pre-financing', // 8
  'get.existing.pre-financing', // 9
  'get.id.pre-financing', // 10
];

// Application pledge
export const applyPledgePattern = [
  'post.apply-pledge', // 0
  'update.apply-pledge', // 1
  'delete.apply-pledge', // 2
  'soft.delete.apply-pledge', // 3
  'patch.restore.apply-pledge', // 4
  'get.list.apply-pledge', // 5
  'get.list.paginate.apply-pledge', // 6
  'get.list.paginate.query.apply-pledge', // 7
  'get.soft.delete.paginate.query.apply-pledge', // 8
  'get.existing.apply-pledge', // 9
  'get.id.apply-pledge', // 10

  'post.genpdf-analysis.apply-pledge', // 11
  'post.genpdf-application.apply-pledge', // 12
  'post.genpdf-draw.apply-pledge', // 13
  'post.genpdf-release.apply-pledge', // 14

  'update.analysis.apply-pledge', // 15
  'update.application.apply-pledge', // 16
  'update.draw.apply-pledge', // 17
  'update.release.apply-pledge', // 18
];

export enum State {
  pending = 0,
  validated = 1,
  rejected = -1,
}

export enum StateLots {
  nantis = 1,
  relacher = 2,
  denantis = 3,
}
export enum StateEmpotage {
  chm_conteneur = 1,
  chm_plomb = 2,
  surpoids = 3,
}

export enum StateChargement {
  valider = 1,
  rejeter = 0,
  refraction = 2,
}

export enum StateTirage {
  decouvert = 1,
  nantissement = 2,
  rapatriement = 3,
  subvention = 4,
  autres = 5,
}

export enum StateBooking {
  encours = 0,
  terminer = 1,
}

export enum ContainerType {
  vingtPied = '40’',
  quarantePied = '20’',
}

export enum TypeMovement {
  credit = 'CREDIT',
  debit = 'DEBIT',
}

export enum NatureOperation {
  appro = 'APPROVISIONNEMENT',
  regleClient = 'REGLEMENT CLIENT',
  nivellement = 'NIVELLEMENT',
  achatCajou = 'ACHAT CAJOU',
  valorisation = 'VALORISATION STOCK FINAL',
  dus = 'DUS',
  miseAfob = 'MISE A FOB',
  magasinage = 'MAGASINAGE',
  magManu = 'MAGASINAGE & MANUTENTION',
  manutention = 'MANUTENTION',
  tierceDetention = 'TIERCE DETENTION',
  chargeViet = 'CHARGES VIETNAM',
  areca = 'ARECA',
  fret = 'FRET MARITIME',
  chargeFonct = 'CHARGES DE FONCTIONNEMENT',
  chargeFin = 'CHARGES FINANCIERES',
  perteChange = 'PERTE DE CHANGE',
  gainChange = 'GAIN DE CHANGE',
  nantissement = 'NANTISSEMENT',
}

export enum TypeDocumentNantissement {
  analyse = 'Demande analyse',
  nantissement = 'Demande nantissement',
  relache = 'Demande relache',
  tirage = 'Demande tirage',
}

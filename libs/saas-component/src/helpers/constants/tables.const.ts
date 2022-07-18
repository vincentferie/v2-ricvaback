import { CreateTable, CreateIndex } from '../interfaces';

export const tablesParamPublic: CreateTable[] = [
  {
    name: 'role',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'libelle',
        type: 'varchar',
        length: '100',
        isUnique: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [],
    schema: 'public',
  },
  {
    name: 'account',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'role_id',
        type: 'uuid',
      },
      {
        name: 'nom',
        type: 'varchar',
        length: '50',
      },
      {
        name: 'prenoms',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'contact',
        type: 'varchar',
        length: '30',
      },
      {
        name: 'username',
        type: 'varchar',
        length: '150',
        isUnique: true,
      },
      {
        name: 'password',
        type: 'varchar',
      },
      {
        name: 'salt',
        type: 'varchar',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'public.role',
        referencedColumnNames: ['id'],
        columnNames: ['role_id'],
      },
    ],
    schema: 'public',
  },
  {
    name: 'refresh_token',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'user_id',
        type: 'uuid',
      },
      {
        name: 'is_revoked',
        type: 'boolean',
      },
      {
        name: 'expires',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'token',
        type: 'varchar',
      },
    ],
    foreignKeys: [],
    schema: 'public',
  },
  {
    name: 'times',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'user',
        type: 'uuid',
      },
      {
        name: 'times',
        type: 'timestamp without time zone',
      },
    ],
    foreignKeys: [],
    schema: 'public',
  },
];

export const tablesParamCashew: CreateTable[] = [
  {
    name: 'campagne',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'libelle',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'state',
        type: 'boolean',
        default: true,
      },
      {
        name: 'ouverture',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'fermeture',
        type: 'timestamp without time zone',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [],
    schema: 'cashew',
  },
  {
    name: 'campagne_outturn',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'min_outturn',
        type: 'float',
      },
      {
        name: 'max_outturn',
        type: 'float',
      },
      {
        name: 'flag',
        type: 'varchar',
        length: '15',
        isNullable: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.campagne',
        referencedColumnNames: ['id'],
        columnNames: ['campagne_id'],
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'campagne_tranche',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'libelle',
        type: 'varchar',
        length: '150',
        isUnique: true,
      },
      {
        name: 'outturn_min',
        type: 'float',
      },
      {
        name: 'outturn_max',
        type: 'float',
      },
      {
        name: 'date_debut',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'date_fin',
        type: 'timestamp without time zone',
      },
      {
        name: 'prix',
        type: 'int',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.campagne',
        referencedColumnNames: ['id'],
        columnNames: ['campagne_id'],
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'document_info',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'refCode',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'destinateur',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'destinataire',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'responsable',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'filename',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'path',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'aws_id',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'type',
        type: 'enum',
        enum: [
          'Demande analyse',
          'Demande nantissement',
          'Demande relache',
          'Demande tirage',
        ],
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [],
    schema: 'cashew',
  },
  {
    name: 'site',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'ville_id',
        type: 'uuid',
      },
      {
        name: 'libelle',
        type: 'varchar',
        length: '150',
        isUnique: true,
      },
      {
        name: 'superficie',
        type: 'float',
        isNullable: true,
      },
      {
        name: 'coordonneex',
        type: 'float',
        isNullable: true,
      },
      {
        name: 'coordonneey',
        type: 'float',
        isNullable: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [],
    schema: 'cashew',
  },
  {
    name: 'entrepot',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'site_id',
        type: 'uuid',
      },
      {
        name: 'libelle',
        type: 'varchar',
        length: '150',
        isUnique: true,
      },
      {
        name: 'superficie',
        type: 'float',
        isNullable: true,
      },
      {
        name: 'coordonneex',
        type: 'float',
        isNullable: true,
      },
      {
        name: 'coordonneey',
        type: 'float',
        isNullable: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.site',
        referencedColumnNames: ['id'],
        columnNames: ['site_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'assignment_entrepot',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'superviseur_id',
        type: 'uuid',
      },
      {
        name: 'entrepot_id',
        type: 'uuid',
      },
      {
        name: 'actif',
        type: 'boolean',
        default: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'public.account',
        referencedColumnNames: ['id'],
        columnNames: ['superviseur_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.entrepot',
        referencedColumnNames: ['id'],
        columnNames: ['entrepot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'assignment_site',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'superviseur_id',
        type: 'uuid',
      },
      {
        name: 'site_id',
        type: 'uuid',
      },
      {
        name: 'actif',
        type: 'boolean',
        default: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'public.account',
        referencedColumnNames: ['id'],
        columnNames: ['superviseur_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.site',
        referencedColumnNames: ['id'],
        columnNames: ['site_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'exportateur',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'raison',
        type: 'varchar',
        length: '150',
        isUnique: true,
      },
      {
        name: 'contribuable',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'contact',
        type: 'varchar',
        length: '30',
      },
      {
        name: 'email',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'postal',
        type: 'varchar',
        length: '100',
      },
      {
        name: 'lieu',
        type: 'varchar',
        length: '255',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [],
    schema: 'cashew',
  },
  {
    name: 'transitaire',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'raison_social',
        type: 'varchar',
        isUnique: true,
        length: '150',
      },
      {
        name: 'denomination',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'localisation',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'contact',
        type: 'varchar',
        length: '30',
        isNullable: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [],
    schema: 'cashew',
  },
  {
    name: 'specificite',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'libelle',
        type: 'varchar',
        length: '150',
        isUnique: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [],
    schema: 'cashew',
  },
  {
    name: 'dechargement',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'superviseur_id',
        type: 'uuid',
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'provenance_id',
        type: 'uuid',
      },
      {
        name: 'specificity_id',
        type: 'uuid',
      },
      {
        name: 'exportateur_id',
        type: 'uuid',
      },
      {
        name: 'entrepot_id',
        type: 'uuid',
      },
      {
        name: 'speculation_id',
        type: 'uuid',
      },
      {
        name: 'num_fiche',
        type: 'varchar',
        length: '150',
        isUnique: true,
      },
      {
        name: 'date_dechargement',
        type: 'timestamp without time zone',
      },
      {
        name: 'tracteur',
        type: 'varchar',
        length: '50',
      },
      {
        name: 'remorque',
        type: 'varchar',
        length: '50',
      },
      {
        name: 'fournisseur',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'contact_fournisseur',
        type: 'varchar',
        length: '50',
      },
      {
        name: 'transporteur',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'statut',
        type: 'enum',
        enum: ['1', '0', '2'],
      },
      {
        name: 'validity',
        type: 'boolean',
        default: false,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.campagne',
        referencedColumnNames: ['id'],
        columnNames: ['campagne_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'public.account',
        referencedColumnNames: ['id'],
        columnNames: ['superviseur_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.exportateur',
        referencedColumnNames: ['id'],
        columnNames: ['exportateur_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.specificite',
        referencedColumnNames: ['id'],
        columnNames: ['specificity_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.entrepot',
        referencedColumnNames: ['id'],
        columnNames: ['entrepot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'file_dechargement',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'dechargement_id',
        type: 'uuid',
      },
      {
        name: 'filename',
        type: 'varchar',
      },
      {
        name: 'path',
        type: 'varchar',
      },
      {
        name: 'aws_id',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.dechargement',
        referencedColumnNames: ['id'],
        columnNames: ['dechargement_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'lot',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'superviseur_id',
        type: 'uuid',
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'site_id',
        type: 'uuid',
      },
      {
        name: 'entrepot_id',
        type: 'uuid',
      },
      {
        name: 'exportateur_id',
        type: 'uuid',
      },
      {
        name: 'speculation_id',
        type: 'uuid',
      },
      {
        name: 'dechargement_id',
        type: 'uuid',
        isUnique: true,
      },
      {
        name: 'specificity_id',
        type: 'uuid',
      },
      {
        name: 'numero_ticket_pese',
        type: 'bigint',
      },
      {
        name: 'code_dechargement',
        type: 'varchar',
        length: '255',
        isUnique: true,
      },
      {
        name: 'numero_lot',
        type: 'bigint',
      },
      {
        name: 'sac_en_stock',
        type: 'int',
      },
      {
        name: 'premiere_pesee',
        type: 'int',
      },
      {
        name: 'deuxieme_pesee',
        type: 'int',
      },
      {
        name: 'reconditionne',
        type: 'int',
      },
      {
        name: 'tare_emballage_refraction',
        type: 'int',
      },
      {
        name: 'sacs_decharge',
        type: 'int',
      },
      {
        name: 'poids_net',
        type: 'int',
      },
      {
        name: 'date_dechargement',
        type: 'timestamp without time zone',
      },
      {
        name: 'statut',
        type: 'enum',
        enum: ['1', '2', '3'],
        isNullable: true,
      },
      {
        name: 'validity',
        type: 'boolean',
        default: false,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.campagne',
        referencedColumnNames: ['id'],
        columnNames: ['campagne_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'public.account',
        referencedColumnNames: ['id'],
        columnNames: ['superviseur_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.exportateur',
        referencedColumnNames: ['id'],
        columnNames: ['exportateur_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.specificite',
        referencedColumnNames: ['id'],
        columnNames: ['specificity_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.entrepot',
        referencedColumnNames: ['id'],
        columnNames: ['entrepot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.dechargement',
        referencedColumnNames: ['id'],
        columnNames: ['dechargement_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'file_ticket_pesee',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'lot_id',
        type: 'uuid',
      },
      {
        name: 'filename',
        type: 'varchar',
      },
      {
        name: 'path',
        type: 'varchar',
      },
      {
        name: 'aws_id',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.lot',
        referencedColumnNames: ['id'],
        columnNames: ['lot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'analyse_lot',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'lot_id',
        type: 'uuid',
      },
      {
        name: 'th',
        type: 'float',
      },
      {
        name: 'grainage',
        type: 'int',
      },
      {
        name: 'out_turn',
        type: 'float',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.lot',
        referencedColumnNames: ['id'],
        columnNames: ['lot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'balance',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'lot_id',
        type: 'uuid',
      },
      {
        name: 'entrepot_id',
        type: 'uuid',
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'nbr_sacs',
        type: 'int',
      },
      {
        name: 'date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.campagne',
        referencedColumnNames: ['id'],
        columnNames: ['campagne_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.lot',
        referencedColumnNames: ['id'],
        columnNames: ['lot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.entrepot',
        referencedColumnNames: ['id'],
        columnNames: ['entrepot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'cession',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'lot_id',
        type: 'uuid',
      },
      {
        name: 'recevant_id',
        type: 'uuid',
      },
      {
        name: 'cedant_id',
        type: 'uuid',
      },
      {
        name: 'date_session',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.exportateur',
        referencedColumnNames: ['id'],
        columnNames: ['cedant_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.exportateur',
        referencedColumnNames: ['id'],
        columnNames: ['recevant_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.lot',
        referencedColumnNames: ['id'],
        columnNames: ['lot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'balayure',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'lot_id',
        type: 'uuid',
      },
      {
        name: 'entrepot_id',
        type: 'uuid',
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'nbr_sacs',
        type: 'int',
      },
      {
        name: 'date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.campagne',
        referencedColumnNames: ['id'],
        columnNames: ['campagne_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.lot',
        referencedColumnNames: ['id'],
        columnNames: ['lot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.entrepot',
        referencedColumnNames: ['id'],
        columnNames: ['entrepot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'transfert',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'lot_id',
        type: 'uuid',
      },
      {
        name: 'entrepot_provenance_id',
        type: 'uuid',
      },
      {
        name: 'entrepot_destination_id',
        type: 'uuid',
      },
      {
        name: 'poids_net_mq',
        type: 'int',
      },
      {
        name: 'sac_mq',
        type: 'int',
      },
      {
        name: 'poids_net_dechet',
        type: 'int',
      },
      {
        name: 'sac_dechet',
        type: 'int',
      },
      {
        name: 'poids_net_poussiere',
        type: 'int',
      },
      {
        name: 'sac_poussiere',
        type: 'int',
      },
      {
        name: 'total_sac_trie',
        type: 'int',
      },
      {
        name: 'statut_triage',
        type: 'int',
      },
      {
        name: 'date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.lot',
        referencedColumnNames: ['id'],
        columnNames: ['lot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.entrepot',
        referencedColumnNames: ['id'],
        columnNames: ['entrepot_provenance_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.entrepot',
        referencedColumnNames: ['id'],
        columnNames: ['entrepot_destination_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'signaler_lot',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'dechargement_id',
        type: 'uuid',
      },
      {
        name: 'lot_id',
        type: 'uuid',
        isNullable: true,
      },
      {
        name: 'superviseur_id',
        type: 'uuid',
      },
      {
        name: 'motif',
        type: 'varchar',
      },
      {
        name: 'text',
        type: 'text',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.dechargement',
        referencedColumnNames: ['id'],
        columnNames: ['dechargement_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.lot',
        referencedColumnNames: ['id'],
        columnNames: ['lot_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'booking',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'numero_reel',
        type: 'varchar',
        length: '30',
        isUnique: true,
      },
      {
        name: 'numero_change',
        type: 'varchar',
        length: '30',
        isUnique: true,
        isNullable: true,
      },
      {
        name: 'state',
        type: 'enum',
        enum: ['0', '1'],
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [],
    schema: 'cashew',
  },
  {
    name: 'file_booking',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'booking_id',
        type: 'uuid',
      },
      {
        name: 'filename',
        type: 'varchar',
      },
      {
        name: 'path',
        type: 'varchar',
      },
      {
        name: 'aws_id',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.booking',
        referencedColumnNames: ['id'],
        columnNames: ['booking_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'conteneur',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'booking_id',
        type: 'uuid',
      },
      {
        name: 'entrepot_id',
        type: 'uuid',
      },
      {
        name: 'numero',
        type: 'varchar',
        length: '25',
        isUnique: true,
      },
      {
        name: 'type_tc',
        type: 'enum',
        enum: ['40’', '20’'],
      },
      {
        name: 'capacite',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.booking',
        referencedColumnNames: ['id'],
        columnNames: ['booking_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.entrepot',
        referencedColumnNames: ['id'],
        columnNames: ['entrepot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'plomb_conteneur',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'conteneur_id',
        type: 'uuid',
      },
      {
        name: 'pb_lettre',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'pb_chiffre',
        type: 'int',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.conteneur',
        referencedColumnNames: ['id'],
        columnNames: ['conteneur_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'plan_empotage',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'entrepot_id',
        type: 'uuid',
      },
      {
        name: 'transitaire_id',
        type: 'uuid',
      },
      {
        name: 'numero',
        type: 'varchar',
        length: '50',
        isUnique: true,
      },
      {
        name: 'state',
        type: 'enum',
        enum: ['0', '1'],
      },
      {
        name: 'date_execution',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.entrepot',
        referencedColumnNames: ['id'],
        columnNames: ['entrepot_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.transitaire',
        referencedColumnNames: ['id'],
        columnNames: ['transitaire_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'plan_empotage_conteneur',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'plan_empotage_id',
        type: 'uuid',
      },
      {
        name: 'conteneur_id',
        type: 'uuid',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.plan_empotage',
        referencedColumnNames: ['id'],
        columnNames: ['plan_empotage_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.conteneur',
        referencedColumnNames: ['id'],
        columnNames: ['conteneur_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'plan_empotage_lots',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'plan_empotage_id',
        type: 'uuid',
      },
      {
        name: 'lot_id',
        type: 'uuid',
      },
      {
        name: 'nbr_sacs',
        type: 'int',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.plan_empotage',
        referencedColumnNames: ['id'],
        columnNames: ['plan_empotage_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.lot',
        referencedColumnNames: ['id'],
        columnNames: ['lot_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'execution_empotage',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'plan_empotage_id',
        type: 'uuid',
      },
      {
        name: 'conteneur_id',
        type: 'uuid',
      },
      {
        name: 'date_execution',
        type: 'timestamp without time zone',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.plan_empotage_lots',
        referencedColumnNames: ['id'],
        columnNames: ['plan_empotage_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.conteneur',
        referencedColumnNames: ['id'],
        columnNames: ['conteneur_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'detail_execution_empotage',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'plan_execution_id',
        type: 'uuid',
      },
      {
        name: 'lot_id',
        type: 'uuid',
      },
      {
        name: 'nbr_sacs',
        type: 'int',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.execution_empotage',
        referencedColumnNames: ['id'],
        columnNames: ['plan_execution_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.lot',
        referencedColumnNames: ['id'],
        columnNames: ['lot_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'bill_lading',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'numero_bl',
        type: 'varchar',
        length: '50',
        isUnique: true,
      },
      {
        name: 'numero_voyage',
        type: 'varchar',
        length: '50',
      },
      {
        name: 'destination',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'provenance',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'amateur',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'nom_client',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'adresse_client',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'pays_client',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'port_depart',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'port_arrive',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'date_embarquement',
        type: 'timestamp without time zone',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.campagne',
        referencedColumnNames: ['id'],
        columnNames: ['campagne_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'file_bill_lading',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'bill_lading_id',
        type: 'uuid',
      },
      {
        name: 'filename',
        type: 'varchar',
      },
      {
        name: 'path',
        type: 'varchar',
      },
      {
        name: 'aws_id',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.bill_lading',
        referencedColumnNames: ['id'],
        columnNames: ['bill_lading_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'details_bill_lading',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'bill_lading_id',
        type: 'uuid',
      },
      {
        name: 'conteneur_id',
        type: 'uuid',
      },
      {
        name: 'nbr_sacs',
        type: 'int',
      },
      {
        name: 'gross_weight',
        type: 'float',
      },
      {
        name: 'tare',
        type: 'float',
      },
      {
        name: 'measurement',
        type: 'float',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.bill_lading',
        referencedColumnNames: ['id'],
        columnNames: ['bill_lading_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.conteneur',
        referencedColumnNames: ['id'],
        columnNames: ['conteneur_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'compte_bancaire',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'banque_id',
        type: 'uuid',
      },
      {
        name: 'solde',
        type: 'bigint',
      },
      {
        name: 'date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.campagne',
        referencedColumnNames: ['id'],
        columnNames: ['campagne_id'],
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'sous_compte_bancaire',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'compte_banque_id',
        type: 'uuid',
      },
      {
        name: 'num_ref',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'libelle',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'solde',
        type: 'bigint',
      },
      {
        name: 'date',
        type: 'timestamp without time zone',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.compte_bancaire',
        referencedColumnNames: ['id'],
        columnNames: ['compte_banque_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'mouvement_compte',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'sous_compte_banque_id',
        type: 'uuid',
      },
      {
        name: 'intitule',
        type: 'varchar',
        length: '255',
      },
      {
        name: 'solde_en_date',
        type: 'bigint',
      },
      {
        name: 'valeur',
        type: 'bigint',
      },
      {
        name: 'nature',
        type: 'enum',
        enum: [
          'APPROVISIONNEMENT',
          'REGLEMENT CLIENT',
          'NIVELLEMENT',
          'ACHAT CAJOU',
          'VALORISATION STOCK FINAL',
          'DUS',
          'MISE A FOB',
          'MAGASINAGE',
          'MAGASINAGE MANUTENTION',
          'MANUTENTION',
          'TIERCE DETENTION',
          'CHARGES VIETNAM',
          'ARECA',
          'FRET MARITIME',
          'CHARGES DE FONCTIONNEMENT',
          'CHARGES FINANCIERES',
          'PERTE DE CHANGE',
          'GAIN DE CHANGE',
          'NANTISSEMENT',
        ],
      },
      {
        name: 'type',
        type: 'enum',
        enum: ['CREDIT', 'DEBIT'],
      },
      {
        name: 'date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.sous_compte_bancaire',
        referencedColumnNames: ['id'],
        columnNames: ['sous_compte_banque_id'],
      },
    ],
    schema: 'cashew',
  },
  {
    name: 'prefinancement',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true,
        default: `uuid_generate_v4()`,
      },
      {
        name: 'campagne_id',
        type: 'uuid',
      },
      {
        name: 'compte_banque_id',
        type: 'uuid',
      },
      {
        name: 'sous_compte_banque_id',
        type: 'uuid',
      },
      {
        name: 'exportateur_id',
        type: 'uuid',
      },
      {
        name: 'numero',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'solde',
        type: 'bigint',
      },
      {
        name: 'date_tirage',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'type',
        type: 'enum',
        enum: ['1', '2', '3', '4', '5'],
      },
      {
        name: 'created_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'created_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'updated_date',
        type: 'timestamp without time zone',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
      },
      {
        name: 'updated_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
      {
        name: 'deleted_date',
        type: 'timestamp without time zone',
        isNullable: true,
      },
      {
        name: 'deleted_by',
        type: 'varchar',
        length: '150',
        isNullable: true,
      },
    ],
    foreignKeys: [
      {
        referencedTableName: 'cashew.campagne',
        referencedColumnNames: ['id'],
        columnNames: ['campagne_id'],
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.exportateur',
        referencedColumnNames: ['id'],
        columnNames: ['exportateur_id'],
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.compte_bancaire',
        referencedColumnNames: ['id'],
        columnNames: ['compte_banque_id'],
        onUpdate: 'CASCADE',
      },
      {
        referencedTableName: 'cashew.sous_compte_bancaire',
        referencedColumnNames: ['id'],
        columnNames: ['sous_compte_banque_id'],
        onUpdate: 'CASCADE',
      },
    ],
    schema: 'cashew',
  },
];

export const tableIndex: CreateIndex[] = [
  {
    name: 'cashew.assignment_entrepot',
    indexName: 'index_assigment_entrepot',
    columnNames: ['superviseur_id', 'entrepot_id'],
  },
  {
    name: 'cashew.assignment_site',
    indexName: 'index_assigment_site',
    columnNames: ['superviseur_id', 'site_id'],
  },
  {
    name: 'cashew.cession',
    indexName: 'index_lot_dest_rest',
    columnNames: ['lot_id', 'recevant_id', 'cedant_id'],
  },
  {
    name: 'cashew.transfert',
    indexName: 'index_lot_prov_dest',
    columnNames: [
      'lot_id',
      'entrepot_provenance_id',
      'entrepot_destination_id',
    ],
  },
  {
    name: 'cashew.plan_empotage_lots',
    indexName: 'index_empotage_plan_lot',
    columnNames: ['plan_empotage_id', 'conteneur_id'],
  },
  {
    name: 'cashew.detail_execution_empotage',
    indexName: 'index_execution_plan_lot',
    columnNames: ['plan_execution_id', 'lot_id'],
  },
  {
    name: 'cashew.plan_empotage_conteneur',
    indexName: 'index_empotage_plan_conteneur',
    columnNames: ['plan_empotage_id', 'conteneur_id'],
  },

  {
    name: 'cashew.execution_empotage',
    indexName: 'index_execution_plan_conteneur',
    columnNames: ['plan_empotage_id', 'conteneur_id'],
  },
  {
    name: 'cashew.details_bill_lading',
    indexName: 'index_details_billoflading',
    columnNames: ['bill_lading_id', 'conteneur_id'],
  },
  {
    name: 'cashew.sous_compte_bancaire',
    indexName: 'index_sub_bank_account',
    columnNames: ['compte_banque_id', 'libelle'],
  },
  {
    name: 'cashew.compte_bancaire',
    indexName: 'index_bank_account',
    columnNames: ['campagne_id', 'banque_id'],
  },
  {
    name: 'cashew.prefinancement',
    indexName: 'index_campagne_exporter_bank_number',
    columnNames: [
      'campagne_id',
      'exportateur_id',
      'compte_banque_id',
      'sous_compte_banque_id',
      'numero',
    ],
  },
];

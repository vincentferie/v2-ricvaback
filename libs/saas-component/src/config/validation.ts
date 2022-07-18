import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .required(),
  APP_PORT: Joi.number().valid(4000, 4001, 3000, 5054, 5055).required(),
  APP_HOSTNAME: Joi.string().valid('localhost').default('localhost'),
  APP_PREFIX: Joi.string()
    .valid('api/cashew', 'api/cocoa', 'api/hevea', 'api/shea')
    .default('api/cashew'),
  MULTER_DEST: Joi.string().valid('./uploads').required(),
  MAX_FILE_SIZE: Joi.number().valid(2097152, 4194304).required(),
  MAX_IMG_SIZE: Joi.number().valid(500000).required(),
  THROTTLE_TTL: Joi.number()
    .valid(5, 10, 15, 30, 60, 120, 300, 600)
    .default(60),
  THROTTLE_LIMIT: Joi.number()
    .valid(5, 10, 200, 500, 100, 500, 1000)
    .default(10),

  DB_HOST: Joi.string()
    .valid('localhost', 'ns3126579.ip-178-33-239.eu')
    .required(),
  DB_USERNAME: Joi.string().valid('ricva_master').required(),
  DB_PASSWORD: Joi.string().valid('KIao7!&&-)^*Kajhsk').required(),
  DB_TYPE: Joi.string()
    .valid('postgres', 'mongodb', 'oracle', 'cockroachdb', 'mariadb')
    .required(),
  DB_NAME: Joi.string().valid('ricva_master').required(),
  DB_PREFIX: Joi.string().valid('master_', 'main_').required(),
  DB_PORT: Joi.number().valid(5432).default(5432),
  DB_SYNCHRONIZE: Joi.boolean().default(true).required(),
  DB_LOGGER: Joi.string().valid('all', 'error').required(),
  DB_DROP_SCHEMA: Joi.boolean().default(false).required(),
  DB_AUTOLOAD_ENTITIES: Joi.boolean().required(),
  DB_CACHE_EANBLE: Joi.boolean().required(),
  DB_CACHE_TYPE: Joi.string()
    .valid('database', 'redis', 'ioredis', 'ioredis/cluster')
    .required(),
  DB_CACHE_DURATION: Joi.number().required(),
  DB_KEEP_CONNECTION_ALIVE: Joi.boolean().required(),
  DB_POOL_SIZE: Joi.number()
    .valid(1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
    .required(),
  DB_POOL_CONNEXION_TIMEOUT_MILLIS: Joi.number()
    .valid(500, 1000, 1500, 2000, 30000)
    .required(),
  DB_POOL_IDLE_TIMEOUT_MILLIS: Joi.number()
    .valid(5054, 10000, 20000, 30000)
    .required(),
  DB_POOL_ALLOW_EXIT_ON_IDLE: Joi.boolean().required(),

  RMQ_TYPE: Joi.string().valid('amqp', 'amqps').required(),
  RMQ_HOST: Joi.string()
    .valid('localhost', 'ns3126579.ip-178-33-239.eu', 'rabbitmq')
    .required(),
  RMQ_PORT: Joi.number().valid(5672).required(),
  RMQ_USER: Joi.string().valid('rabbitmq', 'dtwmwkqx').required(),
  RMQ_PASS: Joi.string()
    .valid(
      '4bed7c9ee26fbac3370f5f5a0e8f0d87ab0e2477',
      'uSFP5jrjrnNDdDT746HULmhczwIixuBm',
    )
    .required(),
  RMQ_VHOST: Joi.string()
    .valid('ricva-cashew', 'dtwmwkqx')
    .required()
    .default('ricva-cashew'),

  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),

  SWAGGER_TITLE: Joi.string().default('RICVA MASTER ERP'),
  SWAGGER_DESCRIPTION: Joi.string().default('The RICVA API MASTER ERP CAJOU'),
  SWAGGER_VERSION: Joi.string().default('V.2'),
  SWAGGER_TAG: Joi.string().default('gateway'),
  SWAGGER_URL: Joi.string().valid('swaggerApi/ricva-cashew').required(),

  PASSPORT_STRATEGY: Joi.string().valid('jwt').required(),
  PASSPORT_PROPERTY: Joi.string().valid('').default(''),
  PASSPORT_SESSION: Joi.boolean().default(false),

  AUTH0_DOMAIN: Joi.string()
    .valid('https://dev-w-yqnx21.eu.auth0.com')
    .default('https://dev-w-yqnx21.eu.auth0.com'),
  AUTH0_CLIENT_ID: Joi.string()
    .valid('yWg0UzKuv7mISOPOQygk0rDbeyWqm7Qt')
    .default('yWg0UzKuv7mISOPOQygk0rDbeyWqm7Qt'),
  AUTH0_CLIENT_SECRET: Joi.string()
    .valid('X5XlVC2qy9i-T3eOPLhnOD6bGgLp5-SuzUIB7PNMyqfPEmksvoM6no4cCDmDNNkr')
    .default(
      'X5XlVC2qy9i-T3eOPLhnOD6bGgLp5-SuzUIB7PNMyqfPEmksvoM6no4cCDmDNNkr',
    ),
  AUTH0_AUDIENCE: Joi.string()
    .valid('https://dev-w-yqnx21.eu.auth0.com/api/v2/')
    .default('https://dev-w-yqnx21.eu.auth0.com/api/v2/'),
  AUTH0_GRANT_TYPE: Joi.string().valid('client_credentials').required(),

  JWT_SECRET: Joi.string()
    .valid(
      'sso*d95190d4-533b-4036-9735-abc4f1ec4af4',
      'sso*31ecf1e2-7f54-4cf4-9df5-ebf5240f8e86',
    )
    .required(),

  JWT_PUBLIC_KEY: Joi.string().valid(''),
  JWT_PRIVATE_KEY: Joi.string().valid(''),
  JWT_SECRET_OR_KEY: Joi.string().valid(''),
  JWT_SECRET_OR_PRIVATE_KEY: Joi.string().valid(''),
  JWT_AUDIENCE: Joi.string()
    .valid(
      'http://localhost:4000/api/cashew/',
      'http://localhost:4001/api/cashew/',
      'http://localhost:4002/api/cashew/',
      'http://localhost:3000/api/cashew/',
      'http://localhost:5054/api/cashew/',
      'http://localhost:5055/api/cashew/',
    )
    .default('http://localhost:3000/api/cashew/'),
  JWT_ISSUER: Joi.string()
    .valid(
      'http://localhost:4000/api/cashew/',
      'http://localhost:4001/api/cashew/',
      'http://localhost:4002/api/cashew/',
      'http://localhost:3000/api/cashew/',
      'http://localhost:5054/api/cashew/',
      'http://localhost:5055/api/cashew/',
    )
    .default('http://localhost:3000/api/cashew/'),
  JWT_OPTION_EXPIRES_IN: Joi.number()
    .valid(60000, 300000, 600000, 86400000, 604800000)
    .required(),
  JWT_OPTION_ALGORITHM: Joi.string().valid('HS256').default('HS256').required(),
  JWT_VERIF_OPTION_CLOCK_TOLERANCE: Joi.number().valid(60000).required(),
  JWT_VERIF_OPTION_ALGORITHM: Joi.string()
    .valid('HS256')
    .default('HS256')
    .required(),
  JWT_VERIF_OPTION_MAX_AGE: Joi.string()
    .valid('600000ms')
    .default('600000ms')
    .required(),
});

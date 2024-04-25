export default () => ({
  port: 8080,
  database: {
    local: {
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DATABASE_LOCAL_PASSWORD,
      database: process.env.DATABASE_LOCAL_NAME,
    },
    staging: {
      type: 'mariadb',
      host: process.env.DATABASE_STAGING_HOST,
      port: process.env.DATABASE_STAGING_PORT,
      username: process.env.DATABASE_STAGING_USERNAME,
      password: process.env.DATABASE_STAGING_PASSWORD,
      database: process.env.DATABASE_STAGING_NAME,
    },
    production: {
      type: 'mariadb',
      host: process.env.DATABASE_PRODUCTION_HOST,
      port: process.env.DATABASE_PRODUCTION_PORT,
      username: process.env.DATABASE_PRODUCTION_USERNAME,
      password: process.env.DATABASE_PRODUCTION_PASSWORD,
      database: process.env.DATABASE_PRODUCTION_NAME,
    },
  },
});

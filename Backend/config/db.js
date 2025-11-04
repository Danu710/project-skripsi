import pkg from 'pg';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// const { Pool } = pkg;

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// pool
//   .connect()
//   .then(() => console.log('✅ Database connected successfully'))
//   .catch((err) => console.error('❌ Database connection error:', err.message));

// export default pool;

const sequelize = new Sequelize(
  process.env.DB_DATABASE, // nama database
  process.env.DB_USER, // user postgres
  process.env.DB_PASSWORD, // password postgres
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // hilangkan log query di terminal
  }
);
try {
  await sequelize.authenticate();
  console.log('✅ Database connected successfully (Sequelize)');
} catch (error) {
  console.error('❌ Database connection error:', error.message);
}

export default sequelize;

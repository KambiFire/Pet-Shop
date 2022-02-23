import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

const dbConfig = {
  HOST: process.env.REACT_APP_DB_HOST,
  USER: process.env.REACT_APP_DB_USER,
  PASSWORD: process.env.REACT_APP_DB_PASSWORD,
  DB: process.env.DATABASE_URL || process.env.REACT_APP_DB_DBNAME,
  PORT: process.env.REACT_APP_DB_PORT,
  dialect: process.env.REACT_APP_DB_DIALECT,
  protocol: process.env.REACT_APP_DB_PROTOCOL,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export const JWT_TOKEN_KEY = { TOKEN_KEY: process.env.JWT_TOKEN_KEY };

export default dbConfig;

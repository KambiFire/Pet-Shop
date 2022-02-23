import seq from "sequelize";
const { Sequelize, DataTypes } = seq;
import dbConfig from "./config.js";

const connection = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    protocol: dbConfig.protocol,
    logging: console.log("Working..."),

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.conn = connection;

db.posts = connection.define("posts", {
  title: DataTypes.STRING,
  body: DataTypes.TEXT,
});

db.images = connection.define("images", {
  post_id: DataTypes.NUMBER,
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  data: DataTypes.BLOB("long"),
});

export default db; // db : { conn, posts, images }

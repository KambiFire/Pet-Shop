const config = require("../config/db.config.js");

const { Sequelize, DataTypes } = require("sequelize");

const dbConnect = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.connect = dbConnect;
db.Sequelize = Sequelize;

// TABLE - Users
db.user = dbConnect.define("Users", {
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

// TABLE - Roles
db.role = dbConnect.define("Roles", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
});

// TABLE - Posts
db.post = dbConnect.define("Posts", {
  title: DataTypes.STRING,
  body: DataTypes.TEXT,
  tags: DataTypes.TEXT,
});

// TABLE - Images
db.image = dbConnect.define("Images", {
  name: DataTypes.STRING,
  caption: DataTypes.STRING,
  description: DataTypes.TEXT,
  tags: DataTypes.TEXT,
  type: DataTypes.STRING,
  size: DataTypes.STRING,
  preview: DataTypes.BLOB("tiny"),
});

// TABLE - Blobs
db.blob = dbConnect.define("Blobs", {
  data: DataTypes.BLOB("long"),
});

// Association: Role - User
db.role.hasMany(db.user);
db.user.belongsTo(db.role, {
  foreignKey: { defaultValue: 1 },
});

// Association: User - Post
db.user.hasMany(db.post);
db.post.belongsTo(db.user);

// Association: Post - Image - User
db.post.hasMany(db.image);
db.image.belongsTo(db.post);
db.image.belongsTo(db.user);

// Association: Image - Blob
db.image.hasOne(db.blob);
db.blob.belongsTo(db.image);

module.exports = db;

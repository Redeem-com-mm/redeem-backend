module.exports = {
  HOST: "db-postgresql-sgp1-72946-do-user-4035363-0.db.ondigitalocean.com",
  PORT: 25060,
  USER: "doadmin",
  PASSWORD: "zbr6z679r6nnxupd",
  DB: "redeem",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
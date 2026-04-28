import SingletonDB from "./SingletonDB.js";

const connection = {
  async query(...args) {
    const db = await SingletonDB.getConnection();
    return db.query(...args);
  },

  async beginTransaction() {
    const db = await SingletonDB.getConnection();
    return db.beginTransaction();
  },

  async commit() {
    const db = await SingletonDB.getConnection();
    return db.commit();
  },

  async rollback() {
    const db = await SingletonDB.getConnection();
    return db.rollback();
  },
};

export default connection;

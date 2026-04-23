import SingletonDB from "./SingletonDB.js";

const connection = {
  async query(...args) {
    const db = await SingletonDB.getConnection();
    return db.query(...args);
  },
};

export default connection;

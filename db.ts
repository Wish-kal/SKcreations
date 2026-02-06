import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("orders.db");

export const initDB = () => {
  db.transaction(tx => {
    // Create orders table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY NOT NULL,
        customer TEXT NOT NULL,
        event_date TEXT NOT NULL,
        total REAL
      );`
    );

    // Create materials table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY NOT NULL,
        order_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price REAL,
        FOREIGN KEY(order_id) REFERENCES orders(id)
      );`
    );
  });
};

export default db;
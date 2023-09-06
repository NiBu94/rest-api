import mysql from 'mysql2/promise';
import config from '../configs/config.js';

const connect = async () => {
  try {
    const db = await mysql.createConnection({
      host: config.secrets.dbHost,
      user: config.secrets.dbUser,
      password: config.secrets.dbPassword,
      database: config.secrets.dbName,
    });
    return db;
  } catch (error) {
    console.error(error);
  }
};

export const insertTokens = async (customToken, paymentToken) => {
  let db;
  try {
    db = await connect();
    const [result] = await db.execute('INSERT INTO `payments` (custom_token, payment_token, timestamp) VALUES (?, ?, ?)', [
      customToken,
      paymentToken,
      new Date(),
    ]);
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    if (db) {
      await db.end();
    }
  }
};

export const getPaymentToken = async (customToken) => {
  let db;
  try {
    db = await connect();
    const [rows] = await db.execute('SELECT payment_token FROM payments WHERE custom_token = ?', [customToken]);

    if (rows.length > 0) {
      console.log('Payment Token:', rows[0].payment_token);
    } else {
      console.log('No record found');
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (db) {
      await db.end();
    }
  }
};

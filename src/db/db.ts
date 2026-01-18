import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "rei",
  password: "rei",
  database: "pet_care",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
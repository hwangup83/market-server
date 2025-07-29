require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');

const app = express();
app.use(cors());
app.use(express.json());

// MariaDB pool 생성
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

// 테스트용 API: 상품 전체 조회
app.get('/api/products', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행중!`);
});

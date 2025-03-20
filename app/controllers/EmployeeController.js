// Library

// UTILS

const response = require('../helpers/apiResponse');

const axios = require('axios');

exports.fetchData = async (req, res) => {
  try {
    const response = await axios.get('https://bit.ly/48ejMhW'); // Gantilah jika URL berubah
    const { RC, RCM, DATA } = response.data;

    if (RC !== 200) {
      return res.status(400).json({ message: RCM });
    }

    // Pisahkan data berdasarkan baris
    const rows = DATA.split('\n');
    if (rows.length < 2) {
      return res.status(400).json({ message: 'Data format invalid or empty' });
    }

    // Ambil header (baris pertama) dan petakan indeks kolom
    const headers = rows[0].split('|').map((h) => h.trim().toUpperCase());
    const idxYMD = headers.indexOf('YMD');
    const idxNAMA = headers.indexOf('NAMA');
    const idxNIM = headers.indexOf('NIM');

    if (idxYMD === -1 || idxNAMA === -1 || idxNIM === -1) {
      return res.status(400).json({ message: 'Invalid data format, missing required fields' });
    }

    // Proses data sesuai indeks yang benar
    let result = rows.slice(1).map((row) => {
      const cols = row.split('|');
      return {
        YMD: cols[idxYMD] || '',
        NAMA: cols[idxNAMA] || '',
        NIM: cols[idxNIM] || '',
      };
    });

    // Ambil query parameter
    const { nama, ymd, nim } = req.query;

    // Filter berdasarkan parameter yang diberikan
    if (nama) {
      result = result.filter((item) =>
        item.NAMA.toLowerCase().includes(nama.toLowerCase())
      );
    }
    if (ymd) {
      result = result.filter((item) => item.YMD === ymd);
    }
    if (nim) {
      result = result.filter((item) => item.NIM === nim);
    }

    return res.json({ status: 'success', total: result.length, data: result });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

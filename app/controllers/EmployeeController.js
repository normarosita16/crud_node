const axios = require('axios');

exports.fetchData = async (req, res) => {
  try {
    const response = await axios.get('https://bit.ly/48ejMhW');
    const { RC, RCM, DATA } = response.data;
    const { nama, ymd, nim, size, page } = req.query;
    const limit = size ? parseInt(size) : 10;
    const currentPage = page ? parseInt(page) : 1;
    const offset = (currentPage - 1) * limit;

    if (RC !== 200) {
      return res.status(400).json({ message: RCM });
    }

    const rows = DATA.split('\n');
    if (rows.length < 2) {
      return res.status(400).json({ message: 'Data format invalid or empty' });
    }

    const headers = rows[0].split('|').map((h) => h.trim().toUpperCase());
    const idxYMD = headers.indexOf('YMD');
    const idxNAMA = headers.indexOf('NAMA');
    const idxNIM = headers.indexOf('NIM');

    if (idxYMD === -1 || idxNAMA === -1 || idxNIM === -1) {
      return res.status(400).json({ message: 'Invalid data format, missing required fields' });
    }

    let result = rows.slice(1).map((row) => {
      const cols = row.split('|');
      return {
        YMD: cols[idxYMD] || '',
        NAMA: cols[idxNAMA] || '',
        NIM: cols[idxNIM] || '',
      };
    });

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

    const paginatedData = result.slice(offset, offset + limit);
    const totalPages = Math.ceil(result.length / limit);

    return res.json({
      status: 'success',
      totalRecords: result.length,
      data: paginatedData,
      totalPages,
      currentPage,
      pageSize: paginatedData.length,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

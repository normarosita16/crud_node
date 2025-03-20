const dotEnv = require('dotenv');
const { Router } = require('express');

const EmployeeController = require('../controllers/EmployeeController');

const router = Router();
dotEnv.config();

router.get('', EmployeeController.fetchData);

module.exports = router;

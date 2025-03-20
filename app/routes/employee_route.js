const dotEnv = require('dotenv');
const { Router } = require('express');

const EmployeeController = require('../controllers/EmployeeController');
const { verifyToken } = require('../helpers/authentication-jwt');
const { permit } = require('../helpers/authorize');

const router = Router();
dotEnv.config();

router.get('',verifyToken, permit(['superadmin']), EmployeeController.fetchData);

module.exports = router;

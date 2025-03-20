const dotEnv = require('dotenv');
const { Router } = require('express');

const RoleController = require('../controllers/MSTRoleController');
const { verifyToken } = require('../helpers/authentication-jwt');
const { permit } = require('../helpers/authorize');

const router = Router();
dotEnv.config();

router.get('', RoleController.list);
router.post('',verifyToken, permit(['superadmin']),RoleController.create);

module.exports = router;

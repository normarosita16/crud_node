const { body, param } = require('express-validator');
const Sequelize = require('sequelize');
const db = require('../models/index');
const sequelize = db.sequelize;
const QueryTypes = db.Sequelize.QueryTypes;
const Op = db.Sequelize.Op;

const Role = db.mst_roles_model;
const User = db.mst_users_model;

// --VALIDATOR USERS & AUTHENTICATION--

module.exports.validateLogin = [
  body('email/username').custom(async (value, { req }) => {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: value }, { username: value }],
      },
    });

    const user1 = await User.findOne({
      where: {
        [Op.or]: [{ email: value }, { username: value }],
        is_active: 0
      },
    });

    if (!user) return Promise.reject('Email yang anda masukan tidak terdaftar di sistem, mohon periksa kembali email anda');
    if (user1) return Promise.reject('Anda belum melakukan verifikasi email untuk pembuatan kata sandi, mohon periksa email anda');

    req.user = user;
  }),
  body('password').not().isEmpty().withMessage('password cannot be empty'),
];


module.exports.validateUpdateUser = [
  body('fullname')
    // .isAlphanumeric('en-US', { ignore: ' ',ignore:"." })
    // .withMessage("fullname must be letters")
    .custom(async (value, { req }) => {
      const user = await User.findOne({
        where: { fullname: value, [Op.not]: { id: Sequelize.literal(`id = f_decrypt('${req.params.id}')`) }, deleted_date: null },
      });
      if (user) {
        return Promise.reject('fullname has been used');
      }
    }),
  body('email')
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({
        where: {
          email: value,
          deleted_date: null,
          [Op.not]: { id: Sequelize.literal(`id = f_decrypt('${req.params.id}')`) },
        },
      }).then((user) => {
        if (user) {
          return Promise.reject('email has been used');
        }
      });
    }),
  body('username').custom((value, { req }) => {
    return User.findOne({
      where: {
        username: value,
        [Op.not]: { id: Sequelize.literal(`id = f_decrypt('${req.params.id}')`) },
      },
    }).then((user) => {
      if (user) {
        return Promise.reject('username has been used');
      }
    });
  }),
];

module.exports.validateCreateUser = [
  body('fullname'),
  // .isAlphanumeric("en-US", { ignore: [" ", "."] })
  // .withMessage("fullname must be letters"),
  body('email')
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({
        where: {
          email: value,
          deleted_date: null,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject('email has been used');
        }
      });
    }),
  body('username').custom((value, { req }) => {
    return User.findOne({
      where: {
        username: value,
        deleted_date: null,
      },
    }).then((user) => {
      if (user) {
        return Promise.reject('username has been used');
      }
    });
  }),
];

// END USERS



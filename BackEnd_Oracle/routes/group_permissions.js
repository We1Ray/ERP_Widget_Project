const DataBaseInfo = require('../DataBaseInfo.json')
const router = require('express').Router()
const fs = require('fs')
const path = require("path");
const lib = require('../library')

router.route('/get_group_permissions').post(async (req, res) => {
   let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
   let parameter = {
      GROUP_UID: (req.body.group_permission_GROUP_UID) ? req.body.group_permission_GROUP_UID : null,
      SYSTEM_UID: (req.body.group_permission_SYSTEM_UID) ? req.body.group_permission_SYSTEM_UID : null,
      PROGRAM_UID: (req.body.group_permission_PROGRAM_UID) ? req.body.group_permission_PROGRAM_UID : null,
      FACTORY_UID: (req.body.group_permission_FACTORY_UID) ? req.body.group_permission_FACTORY_UID : null,
   }
   let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group_permissions/get_group_permissions.sql')).toString()
   await lib.requestAPI('/get_group_permissions', DBConfig, sql, parameter, res)
})

router.route('/update_group_permission').post(async (req, res) => {
   let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
   let parameter = {
      ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null,
      GROUP_UID: (req.body.GROUP_UID) ? req.body.GROUP_UID : null,
      FUNCTION_UID: (req.body.FUNCTION_UID) ? req.body.FUNCTION_UID : null,
      IS_OPEN: (req.body.IS_OPEN) ? req.body.IS_OPEN : null,
      EDITABLE: (req.body.EDITABLE) ? req.body.EDITABLE : null,
      FACTORY_UID: (req.body.FACTORY_UID) ? req.body.FACTORY_UID : null,
   }
   let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group_permissions/update_group_permission.sql')).toString()
   await lib.executeAPI('/update_group_permission', DBConfig, sql, parameter, res)
})

module.exports = router;

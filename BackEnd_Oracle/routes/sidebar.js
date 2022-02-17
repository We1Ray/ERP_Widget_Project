const DataBaseInfo = require('../DataBaseInfo.json')
const router = require('express').Router()
const fs = require('fs')
const path = require("path");
const lib = require('../library')

router.route('/get_account_available_menu').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        ACCOUNT_UID: (req.body.ACCOUNT_UID) ? req.body.ACCOUNT_UID : null,
        ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null,
        SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
        PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null,
        LANGUAGE: (req.body.LANGUAGE) ? req.body.LANGUAGE : null,
        FACTORY_UID: (req.body.FACTORY_UID) ? req.body.FACTORY_UID : null,
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/sidebar/get_account_available_menu.sql')).toString()
    await lib.requestAPI('/get_account_available_menu', DBConfig, sql, parameter, res)
})

module.exports = router;

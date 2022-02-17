const DataBaseInfo = require('../DataBaseInfo.json')
const router = require('express').Router()
const fs = require('fs')
const path = require("path");
const lib = require('../library')

router.route('/get_account_available_systems').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        systemadmin_ACCOUNT_UID: (req.body.systemadmin_ACCOUNT_UID) ? req.body.systemadmin_ACCOUNT_UID : null,
        systemadmin_ACCESS_TOKEN: (req.body.systemadmin_ACCESS_TOKEN) ? req.body.systemadmin_ACCESS_TOKEN : null,
        systemadmin_SYSTEM_NAME: (req.body.systemadmin_SYSTEM_NAME) ? req.body.systemadmin_SYSTEM_NAME : null,
        systemadmin_SYSTEM_TYPE: (req.body.systemadmin_SYSTEM_TYPE) ? req.body.systemadmin_SYSTEM_TYPE : null,
        systemadmin_SYSTEM_UID: (req.body.systemadmin_SYSTEM_UID) ? req.body.systemadmin_SYSTEM_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system/get_account_available_systems.sql')).toString()
    await lib.requestAPI('/get_account_available_systems', DBConfig, sql, parameter, res)
})

router.route('/get_system_type_list').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system/get_system_type_list.sql')).toString()
    await lib.requestAPI('/get_system_type_list', DBConfig, sql, {}, res)
})

router.route('/create_system').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}

    let executeList = []

    executeList.push(
        {

            parameter : {
                SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
                SYSTEM_NAME: (req.body.SYSTEM_NAME) ? req.body.SYSTEM_NAME : null,
                SYSTEM_DESC: (req.body.SYSTEM_DESC) ? req.body.SYSTEM_DESC : null,
                SECRET_KEY: (req.body.SECRET_KEY) ? req.body.SECRET_KEY : null,
                ENABLED: (req.body.ENABLED) ? req.body.ENABLED : null,
                SYSTEM_TYPE: (req.body.SYSTEM_TYPE) ? req.body.SYSTEM_TYPE : null,
                ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
            },
            sql : fs.readFileSync(path.resolve(__dirname, '../sql/system/create_system.sql')).toString()

        }
    )

    executeList.push(
        {

            parameter : {
                SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
                ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
            },
            sql : fs.readFileSync(path.resolve(__dirname, '../sql/system/create_system_available_user.sql')).toString()

        }
    )

    await lib.executeAPIs('/create_system', DBConfig, executeList, res)
})

router.route('/update_system').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
        SYSTEM_NAME: (req.body.SYSTEM_NAME) ? req.body.SYSTEM_NAME : null,
        SYSTEM_DESC: (req.body.SYSTEM_DESC) ? req.body.SYSTEM_DESC : null,
        ENABLED: (req.body.ENABLED) ? req.body.ENABLED : null,
        SYSTEM_TYPE: (req.body.SYSTEM_TYPE) ? req.body.SYSTEM_TYPE : null,
        ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system/update_system.sql')).toString()
    await lib.executeAPI('/update_system', DBConfig, sql, parameter, res)
})

module.exports = router;

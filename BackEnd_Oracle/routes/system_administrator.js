const DataBaseInfo = require('../DataBaseInfo.json')
const router = require('express').Router()
const fs = require('fs')
const path = require("path");
const lib = require('../library')

router.route('/get_system_administrator').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        administrator_SYSTEM_UID: (req.body.administrator_SYSTEM_UID) ? req.body.administrator_SYSTEM_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_administrator/get_system_administrator.sql')).toString()
    await lib.requestAPI('/get_system_administrator', DBConfig, sql, parameter, res)
})

router.route('/get_accounts_not_in_system').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        account_not_in_system_KEY: (req.body.account_not_in_system_KEY) ? req.body.account_not_in_system_KEY : null,
        SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_administrator/get_accounts_not_in_system.sql')).toString()
    await lib.requestAPI('/get_accounts_not_in_system', DBConfig, sql, parameter, res)
})

router.route('/get_account_info').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        Key: (req.body.Key) ? req.body.Key : null,
        ACCOUNT_UID: (req.body.ACCOUNT_UID) ? req.body.ACCOUNT_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_administrator/get_account_info.sql')).toString()
    await lib.requestAPI('/get_account_info', DBConfig, sql, parameter, res)
})

router.route('/create_system_administrator').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        ACCOUNT_UID: (req.body.ACCOUNT_UID) ? req.body.ACCOUNT_UID : null,
        SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
        EXPIRATION_DATE: (req.body.EXPIRATION_DATE) ? req.body.EXPIRATION_DATE : null,
        ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_administrator/create_system_administrator.sql')).toString()
    await lib.executeAPI('/create_system_administrator', DBConfig, sql, parameter, res)
})

router.route('/update_system_administrator').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null,
        EXPIRATION_DATE: (req.body.EXPIRATION_DATE) ? req.body.EXPIRATION_DATE : null,
        SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
        ACCOUNT_UID: (req.body.ACCOUNT_UID) ? req.body.ACCOUNT_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_administrator/update_system_administrator.sql')).toString()
    await lib.executeAPI('/update_system_administrator', DBConfig, sql, parameter, res)
})

router.route('/delete_system_administrator').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_administrator/delete_system_administrator.sql')).toString()
    if (Array.isArray(req.body)) {
        let parameter = []
        await Promise.all(req.body.map(async (element) => {
            try {
                parameter.push({
                    ACCOUNT_UID: (element.ACCOUNT_UID) ? element.ACCOUNT_UID : null,
                    SYSTEM_UID: (element.SYSTEM_UID) ? element.SYSTEM_UID : null
                })
            } catch (error) {
                console.log('error' + error);
            }
        }))
        await lib.executeAPI('/delete_system_administrator', DBConfig, sql, parameter, res)
    } else {
        let parameter = {
            ACCOUNT_UID: (req.body.ACCOUNT_UID) ? req.body.ACCOUNT_UID : null,
            SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null
        }
        await lib.executeAPI('/delete_system_administrator', DBConfig, sql, parameter, res)
    }
})
module.exports = router;

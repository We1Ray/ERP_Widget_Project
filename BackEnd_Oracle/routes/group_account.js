const DataBaseInfo = require('../DataBaseInfo.json')
const router = require('express').Router()
const fs = require('fs')
const path = require("path");
const lib = require('../library')

router.route('/get_accounts_in_group').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        GROUP_UID: (req.body.group_account_GROUP_UID) ? req.body.group_account_GROUP_UID : null,
        SEARCH_VALUE: (req.body.group_account_SEARCH_VALUE) ? req.body.group_account_SEARCH_VALUE : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group_account/get_accounts_in_group.sql')).toString()
    await lib.requestAPI('/get_accounts_in_group', DBConfig, sql, parameter, res)
})

router.route('/get_accounts_not_in_group').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        account_not_group_KEY: (req.body.account_not_group_KEY) ? req.body.account_not_group_KEY : null,
        account_not_group_ACCOUNT_UID: (req.body.account_not_group_ACCOUNT_UID) ? req.body.account_not_group_ACCOUNT_UID : null,
        GROUP_UID: (req.body.GROUP_UID) ? req.body.GROUP_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group_account/get_accounts_not_in_group.sql')).toString()
    await lib.requestAPI('/get_accounts_not_in_group', DBConfig, sql, parameter, res)
})

router.route('/switch_account_into_group').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group_account/switch_account_into_group.sql')).toString()
    if (Array.isArray(req.body)) {
        let parameter = []
        await Promise.all(req.body.map(async (element) => {
            try {
                parameter.push({
                    ACCESS_TOKEN: (element.ACCESS_TOKEN) ? element.ACCESS_TOKEN : null,
                    GROUP_UID: (element.GROUP_UID) ? element.GROUP_UID : null,
                    ACCOUNT_UID: (element.ACCOUNT_UID) ? element.ACCOUNT_UID : null,
                })
            } catch (error) {
                console.log('error' + error);
            }
        }))
        await lib.executeAPI('/switch_account_into_group', DBConfig, sql, parameter, res)
    } else {
        let parameter = {
            ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null,
            GROUP_UID: (req.body.GROUP_UID) ? req.body.GROUP_UID : null,
            ACCOUNT_UID: (req.body.ACCOUNT_UID) ? req.body.ACCOUNT_UID : null,
        }
        await lib.executeAPI('/switch_account_into_group', DBConfig, sql, parameter, res)
    }
})

module.exports = router;

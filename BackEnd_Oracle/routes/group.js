const DataBaseInfo = require('../DataBaseInfo.json')
const router = require('express').Router()
const fs = require('fs')
const path = require("path");
const lib = require('../library')

router.route('/get_group_list_for_admin').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        group_GROUP_NAME: (req.body.group_GROUP_NAME) ? req.body.group_GROUP_NAME : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group/get_group_list_for_admin.sql')).toString()
    await lib.requestAPI('/get_group_list_for_admin', DBConfig, sql, parameter, res)
})

router.route('/qry_group_name').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        GROUP_UID: (req.body.GROUP_UID) ? req.body.GROUP_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group/qry_group_name.sql')).toString()
    await lib.requestAPI('/qry_group_name', DBConfig, sql, parameter, res)
})

router.route('/create_group').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        GROUP_UID: (req.body.GROUP_UID) ? req.body.GROUP_UID : null,
        GROUP_NAME: (req.body.GROUP_NAME) ? req.body.GROUP_NAME : null,
        IS_CORE: (req.body.IS_CORE) ? req.body.IS_CORE : null,
        ENABLED: (req.body.ENABLED) ? req.body.ENABLED : null,
        ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null,
        PARENT_GROUP_UID: (req.body.PARENT_GROUP_UID) ? req.body.PARENT_GROUP_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group/create_group.sql')).toString()
    await lib.executeAPI('/create_group', DBConfig, sql, parameter, res)
})

router.route('/update_group').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null,
        GROUP_UID: (req.body.GROUP_UID) ? req.body.GROUP_UID : null,
        GROUP_NAME: (req.body.GROUP_NAME) ? req.body.GROUP_NAME : null,
        IS_CORE: (req.body.IS_CORE) ? req.body.IS_CORE : null,
        ENABLED: (req.body.ENABLED) ? req.body.ENABLED : null,
        PARENT_GROUP_UID: (req.body.PARENT_GROUP_UID) ? req.body.PARENT_GROUP_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group/update_group.sql')).toString()
    await lib.executeAPI('/update_group', DBConfig, sql, parameter, res)
})

router.route('/delete_group').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        GROUP_UID: (req.body.GROUP_UID) ? req.body.GROUP_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/group/delete_group.sql')).toString()
    await lib.executeAPI('/delete_group', DBConfig, sql, parameter, res)
})

module.exports = router;

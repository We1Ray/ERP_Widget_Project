const DataBaseInfo = require('../DataBaseInfo.json')
const router = require('express').Router()
const fs = require('fs')
const path = require("path");
const lib = require('../library')

router.route('/get_system_program_functions').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        functionadmin_PROGRAM_UID: (req.body.functionadmin_PROGRAM_UID) ? req.body.functionadmin_PROGRAM_UID : null,
        functionadmin_SYSTEM_UID: (req.body.functionadmin_SYSTEM_UID) ? req.body.functionadmin_SYSTEM_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_program_function/get_system_program_functions.sql')).toString()
    await lib.requestAPI('/get_system_program_functions', DBConfig, sql, parameter, res)
})

router.route('/create_system_program_function').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null,
        SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
        FUNCTION_UID: (req.body.FUNCTION_UID) ? req.body.FUNCTION_UID : null,
        FUNCTION_CODE: (req.body.FUNCTION_CODE) ? req.body.FUNCTION_CODE : null,
        FUNCTION_NAME: (req.body.FUNCTION_NAME) ? req.body.FUNCTION_NAME : null,
        FUNCTION_DESC: (req.body.FUNCTION_DESC) ? req.body.FUNCTION_DESC : null,
        IS_CORE: (req.body.IS_CORE) ? req.body.IS_CORE : null,
        ENABLED: (req.body.ENABLED) ? req.body.ENABLED : null,
        SEQ: (req.body.SEQ) ? req.body.SEQ : null,
        ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_program_function/create_system_program_function.sql')).toString()
    await lib.executeAPI('/create_system_program_function', DBConfig, sql, parameter, res)
})

router.route('/update_system_program_function').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null,
        FUNCTION_UID: (req.body.FUNCTION_UID) ? req.body.FUNCTION_UID : null,
        FUNCTION_NAME: (req.body.FUNCTION_NAME) ? req.body.FUNCTION_NAME : null,
        FUNCTION_DESC: (req.body.FUNCTION_DESC) ? req.body.FUNCTION_DESC : null,
        FUNCTION_CODE: (req.body.FUNCTION_CODE) ? req.body.FUNCTION_CODE : null,
        IS_CORE: (req.body.IS_CORE) ? req.body.IS_CORE : null,
        ENABLED: (req.body.ENABLED) ? req.body.ENABLED : null,
        SEQ: (req.body.SEQ) ? req.body.SEQ : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_program_function/update_system_program_function.sql')).toString()
    await lib.executeAPI('/update_system_program_function', DBConfig, sql, parameter, res)
})

router.route('/delete_system_program_function').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_program_function/delete_system_program_function.sql')).toString()
    if (Array.isArray(req.body)) {
        let parameter = []
        await Promise.all(req.body.map(async (element) => {
            try {
                parameter.push({
                    FUNCTION_UID: (element.FUNCTION_UID) ? element.FUNCTION_UID : null
                })
            } catch (error) {
                console.log('error' + error);
            }
        }))
        await lib.executeAPI('/delete_system_program_function', DBConfig, sql, parameter, res)
    } else {
        let parameter = {
            FUNCTION_UID: (req.body.FUNCTION_UID) ? req.body.FUNCTION_UID : null
        }
        await lib.executeAPI('/delete_system_program_function', DBConfig, sql, parameter, res)
    }
})

module.exports = router;

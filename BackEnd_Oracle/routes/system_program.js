const DataBaseInfo = require('../DataBaseInfo.json')
const router = require('express').Router()
const fs = require('fs')
const path = require("path");
const lib = require('../library')

router.route('/get_system_programs_for_admin').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        programadmin_SYSTEM_UID: (req.body.programadmin_SYSTEM_UID) ? req.body.programadmin_SYSTEM_UID : null,
        programadmin_NODE_LEVEL: (req.body.programadmin_NODE_LEVEL) ? req.body.programadmin_NODE_LEVEL : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_program/get_system_programs_for_admin.sql')).toString()
    await lib.requestAPI('/get_system_programs_for_admin', DBConfig, sql, parameter, res)
})

router.route('/qry_programadim_program_name').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_program/qry_programadim_program_name.sql')).toString()
    await lib.requestAPI('/qry_programadim_program_name', DBConfig, sql, parameter, res)
})

router.route('/create_system_program').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}

    let executeList = []

    executeList.push(
        {
            parameter : {
                PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null,
                SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
                PROGRAM_CODE: (req.body.PROGRAM_CODE) ? req.body.PROGRAM_CODE : null,
                PROGRAM_NAME: (req.body.PROGRAM_NAME) ? req.body.PROGRAM_NAME : null,
                I18N: (req.body.I18N) ? req.body.I18N : null,
                ICON: (req.body.ICON) ? req.body.ICON : null,
                PATH: (req.body.PATH) ? req.body.PATH : null,
                PARENT_UID: (req.body.PARENT_UID) ? req.body.PARENT_UID : null,
                IS_DIR: (req.body.IS_DIR) ? req.body.IS_DIR : null,
                ENABLED: (req.body.ENABLED) ? req.body.ENABLED : null,
                NODE_LEVEL: (req.body.NODE_LEVEL) ? req.body.NODE_LEVEL : null,
                SEQ: (req.body.SEQ) ? req.body.SEQ : null,
                ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
            },
            sql : fs.readFileSync(path.resolve(__dirname, '../sql/system_program/create_system_program.sql')).toString()

        }
    )

    executeList.push(
        {

            parameter : [
                
                {
                    PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null,
                    SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
                    FUNCTION_UID: 'FU-' + lib.uuid(),
                    FUNCTION_CODE: 'read',
                    FUNCTION_NAME: (req.body.PROGRAM_NAME) ? '讀取-' + req.body.PROGRAM_NAME : null,
                    FUNCTION_DESC: '讀取',
                    IS_CORE: 'N',
                    ENABLED: 'Y',
                    SEQ: 1,
                    ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
                }, 
                {
                    PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null,
                    SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
                    FUNCTION_UID: 'FU-' + lib.uuid(),
                    FUNCTION_CODE: 'query',
                    FUNCTION_NAME: (req.body.PROGRAM_NAME) ? '查詢-' + req.body.PROGRAM_NAME : null,
                    FUNCTION_DESC: '查詢',
                    IS_CORE: 'N',
                    ENABLED: 'Y',
                    SEQ: 2,
                    ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
                }, 
                {
                    PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null,
                    SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
                    FUNCTION_UID: 'FU-' + lib.uuid(),
                    FUNCTION_CODE: 'create',
                    FUNCTION_NAME: (req.body.PROGRAM_NAME) ? '新增-' + req.body.PROGRAM_NAME : null,
                    FUNCTION_DESC: '新增',
                    IS_CORE: 'N',
                    ENABLED: 'Y',
                    SEQ: 3,
                    ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
                }, 
                {
                    PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null,
                    SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
                    FUNCTION_UID: 'FU-' + lib.uuid(),
                    FUNCTION_CODE: 'update',
                    FUNCTION_NAME: (req.body.PROGRAM_NAME) ? '修改-' + req.body.PROGRAM_NAME : null,
                    FUNCTION_DESC: '修改',
                    IS_CORE: 'N',
                    ENABLED: 'Y',
                    SEQ: 4,
                    ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
                }, 
                {
                    PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null,
                    SYSTEM_UID: (req.body.SYSTEM_UID) ? req.body.SYSTEM_UID : null,
                    FUNCTION_UID: 'FU-' + lib.uuid(),
                    FUNCTION_CODE: 'delete',
                    FUNCTION_NAME: (req.body.PROGRAM_NAME) ? '刪除-' + req.body.PROGRAM_NAME : null,
                    FUNCTION_DESC: '刪除',
                    IS_CORE: 'N',
                    ENABLED: 'Y',
                    SEQ: 5,
                    ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
                }

            ],
            sql : fs.readFileSync(path.resolve(__dirname, '../sql/system_program_function/create_system_program_function.sql')).toString()

        }
    )

    await lib.executeAPIs('/create_system_program', DBConfig, executeList, res)

})

router.route('/update_system_program').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null,
        PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null,
        PROGRAM_CODE: (req.body.PROGRAM_CODE) ? req.body.PROGRAM_CODE : null,
        PROGRAM_NAME: (req.body.PROGRAM_NAME) ? req.body.PROGRAM_NAME : null,
        I18N: (req.body.I18N) ? req.body.I18N : null,
        ICON: (req.body.ICON) ? req.body.ICON : null,
        PATH: (req.body.PATH) ? req.body.PATH : null,
        SEQ: (req.body.SEQ) ? req.body.SEQ : null,
        ENABLED: (req.body.ENABLED) ? req.body.ENABLED : null,
        IS_DIR: (req.body.IS_DIR) ? req.body.IS_DIR : null
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_program/update_system_program.sql')).toString()
    await lib.executeAPI('/update_system_program', DBConfig, sql, parameter, res)
})

router.route('/delete_system_program').post(async (req, res) => {
    
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        PROGRAM_UID: (req.body.PROGRAM_UID) ? req.body.PROGRAM_UID : null
    }

    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/system_program/delete_system_program.sql')).toString()
    await lib.executeAPI('/delete_system_program', DBConfig, sql, parameter, res)
    
})

module.exports = router;

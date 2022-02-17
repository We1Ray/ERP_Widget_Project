const DataBaseInfo = require('../DataBaseInfo.json')
const router = require('express').Router()
const fs = require('fs')
const path = require("path");
const lib = require('../library')

router.route('/get_languagelocalisation').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let parameter = {
        languagelocalisation_KEY: (req.body.languagelocalisation_KEY) ? req.body.languagelocalisation_KEY : null,
        languagelocalisation_SOURCE: (req.body.languagelocalisation_SOURCE) ? req.body.languagelocalisation_SOURCE : null,
        languagelocalisation_LANGUAGE: (req.body.languagelocalisation_LANGUAGE) ? req.body.languagelocalisation_LANGUAGE : null,
        languagelocalisation_UP_DATE1: (req.body.languagelocalisation_UP_DATE1) ? req.body.languagelocalisation_UP_DATE1 : null,
        languagelocalisation_UP_DATE2: (req.body.languagelocalisation_UP_DATE2) ? req.body.languagelocalisation_UP_DATE2 : null,
    }
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/languagelocalisation/get_languagelocalisation.sql')).toString()
    await lib.requestAPI('/get_languagelocalisation', DBConfig, sql, parameter, res)
})

router.route('/get_language_list').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/languagelocalisation/get_language_list.sql')).toString()
    await lib.requestAPI('/get_language_list', DBConfig, sql, {}, res)
})

router.route('/get_source_list').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/languagelocalisation/get_source_list.sql')).toString()
    await lib.requestAPI('/get_source_list', DBConfig, sql, {}, res)
})

router.route('/create_languagelocalisation').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/languagelocalisation/create_languagelocalisation.sql')).toString()
    if (Array.isArray(req.body)) {
        let parameter = []
        await Promise.all(req.body.map(async (element) => {
            try {
                parameter.push({
                    LANGUAGE: (element.LANGUAGE) ? element.LANGUAGE : null,
                    SOURCE: (element.SOURCE) ? element.SOURCE : null,
                    WORD: (element.WORD) ? element.WORD : null,
                    DISPLAY: (element.DISPLAY) ? element.DISPLAY : null,
                    ACCESS_TOKEN: (element.ACCESS_TOKEN) ? element.ACCESS_TOKEN : null
                })
            } catch (error) {
                console.log('error' + error);
            }
        }))
        await lib.executeAPI('/create_languagelocalisation', DBConfig, sql, parameter, res)
    } else {
        let parameter = {
            LANGUAGE: (req.body.LANGUAGE) ? req.body.LANGUAGE : null,
            SOURCE: (req.body.SOURCE) ? req.body.SOURCE : null,
            WORD: (req.body.WORD) ? req.body.WORD : null,
            DISPLAY: (req.body.DISPLAY) ? req.body.DISPLAY : null,
            ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
        }
        await lib.executeAPI('/create_languagelocalisation', DBConfig, sql, parameter, res)
    }
})

router.route('/update_languagelocalisation').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/languagelocalisation/update_languagelocalisation.sql')).toString()
    if (Array.isArray(req.body)) {
        let parameter = []
        await Promise.all(req.body.map(async (element) => {
            try {
                parameter.push({
                    LANGUAGE: (element.LANGUAGE) ? element.LANGUAGE : null,
                    SOURCE: (element.SOURCE) ? element.SOURCE : null,
                    WORD: (element.WORD) ? element.WORD : null,
                    DISPLAY: (element.DISPLAY) ? element.DISPLAY : null,
                    ACCESS_TOKEN: (element.ACCESS_TOKEN) ? element.ACCESS_TOKEN : null,
                })
            } catch (error) {
                console.log('error' + error);
            }
        }))
        await lib.executeAPI('/update_languagelocalisation', DBConfig, sql, parameter, res)
    } else {
        let parameter = {
            LANGUAGE: (req.body.LANGUAGE) ? req.body.LANGUAGE : null,
            SOURCE: (req.body.SOURCE) ? req.body.SOURCE : null,
            WORD: (req.body.WORD) ? req.body.WORD : null,
            DISPLAY: (req.body.DISPLAY) ? req.body.DISPLAY : null,
            ACCESS_TOKEN: (req.body.ACCESS_TOKEN) ? req.body.ACCESS_TOKEN : null
        }
        await lib.executeAPI('/update_languagelocalisation', DBConfig, sql, parameter, res)
    }
})

router.route('/delete_languagelocalisation').post(async (req, res) => {
    let DBConfig = (req.headers.factory) ? DataBaseInfo[req.headers.factory] : {}
    let sql = fs.readFileSync(path.resolve(__dirname, '../sql/languagelocalisation/delete_languagelocalisation.sql')).toString()
    if (Array.isArray(req.body)) {
        let parameter = []
        await Promise.all(req.body.map(async (element) => {
            try {
                parameter.push({
                    LANGUAGE: (element.LANGUAGE) ? element.LANGUAGE : null,
                    SOURCE: (element.SOURCE) ? element.SOURCE : null,
                    WORD: (element.WORD) ? element.WORD : null,
                })
            } catch (error) {
                console.log('error' + error);
            }
        }))
        await lib.executeAPI('/delete_languagelocalisation', DBConfig, sql, parameter, res)
    } else {
        let parameter = {
            LANGUAGE: (req.body.LANGUAGE) ? req.body.LANGUAGE : null,
            SOURCE: (req.body.SOURCE) ? req.body.SOURCE : null,
            WORD: (req.body.WORD) ? req.body.WORD : null,
        }
        await lib.executeAPI('/delete_languagelocalisation', DBConfig, sql, parameter, res)
    }
})

module.exports = router;

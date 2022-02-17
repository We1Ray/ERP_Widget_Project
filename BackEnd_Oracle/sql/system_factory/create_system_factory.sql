INSERT INTO SYSTEM_FACTORY_LIST (FACTORY_UID,
                                 SYSTEM_UID,
                                 FACTORY_NAME,
                                 WS_URL,
                                 WS_DATASOURCE,
                                 IS_ENABLED)
     VALUES ( :FACTORY_UID,
             :SYSTEM_UID,
             :FACTORY_NAME,
             :WS_URL,
             :WS_DATASOURCE,
             NVL ( :IS_ENABLED, 'N'))
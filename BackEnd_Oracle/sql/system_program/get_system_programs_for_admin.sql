  SELECT PROGRAM_UID,
         SYSTEM_UID,
         PROGRAM_CODE,
         PROGRAM_NAME,
         I18N,
         ICON,
         PATH,
         PARENT_UID,
         IS_DIR,
         ENABLED,
         NODE_LEVEL,
         SEQ
    FROM PROGRAM_LIST
   WHERE     SYSTEM_UID = :programadmin_SYSTEM_UID
         AND NODE_LEVEL = NVL ( :programadmin_NODE_LEVEL, NODE_LEVEL)
ORDER BY NODE_LEVEL, SEQ
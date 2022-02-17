INSERT INTO PROGRAM_LIST (PROGRAM_UID,
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
                          SEQ,
                          UP_USER,
                          UP_DATE,
                          CREATE_USER,
                          CREATE_DATE)
   SELECT :PROGRAM_UID,
          :SYSTEM_UID,
          :PROGRAM_CODE,
          :PROGRAM_NAME,
          :I18N,
          :ICON,
          :PATH,
          :PARENT_UID,
          CASE
             WHEN :IS_DIR IS NOT NULL THEN :IS_DIR
             WHEN :PATH IS NULL THEN 'Y'
             ELSE 'N'
          END
             IS_DIR,
          :ENABLED,
          :NODE_LEVEL,
          :SEQ,
          (SELECT C.ACCOUNT
             FROM ACCOUNT_TOKEN A, ACCOUNTS C
            WHERE     A.ACCESS_TOKEN = :ACCESS_TOKEN
                  AND a.EXPIRATION_DATE >= TRUNC (SYSDATE)
                  AND A.IS_EFFECTIVE = 'Y'
                  AND A.ACCOUNT_UID = C.ACCOUNT_UID)
             UP_USER,
          SYSDATE,
          (SELECT C.ACCOUNT
             FROM ACCOUNT_TOKEN A, ACCOUNTS C
            WHERE     A.ACCESS_TOKEN = :ACCESS_TOKEN
                  AND a.EXPIRATION_DATE >= TRUNC (SYSDATE)
                  AND A.IS_EFFECTIVE = 'Y'
                  AND A.ACCOUNT_UID = C.ACCOUNT_UID)
             CREATE_USER,
          SYSDATE
     FROM DUAL
    WHERE EXISTS
             (SELECT C.ACCOUNT
                FROM ACCOUNT_TOKEN A, ACCOUNTS C
               WHERE     A.ACCESS_TOKEN = :ACCESS_TOKEN
                     AND a.EXPIRATION_DATE >= TRUNC (SYSDATE)
                     AND A.IS_EFFECTIVE = 'Y'
                     AND A.ACCOUNT_UID = C.ACCOUNT_UID)
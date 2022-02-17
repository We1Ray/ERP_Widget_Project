MERGE INTO GROUP_FUNCTION_SETTING t
     USING (SELECT C.ACCOUNT,
                   CASE WHEN :IS_OPEN = 'Y' THEN 1 ELSE 0 END IS_OPEN,
                   :GROUP_UID GROUP_UID,
                   :FUNCTION_UID FUNCTION_UID,
                   :FACTORY_UID FACTORY_UID
              FROM ACCOUNT_TOKEN A, ACCOUNTS C
             WHERE     A.ACCESS_TOKEN = :ACCESS_TOKEN
                   AND EXPIRATION_DATE >= TRUNC (SYSDATE)
                   AND IS_EFFECTIVE = 'Y'
                   AND A.ACCOUNT_UID = C.ACCOUNT_UID
                   AND :GROUP_UID IS NOT NULL
                   AND :FUNCTION_UID IS NOT NULL
                   AND :EDITABLE = 'Y') s
        ON (    t.GROUP_UID = s.GROUP_UID
            AND t.FUNCTION_UID = s.FUNCTION_UID
            AND t.FACTORY_UID = s.FACTORY_UID)
WHEN NOT MATCHED
THEN
   INSERT     (GROUP_UID,
               FACTORY_UID,
               FUNCTION_UID,
               IS_OPEN,
               UP_USER,
               UP_DATE,
               CREATE_USER,
               CREATE_DATE)
       VALUES (s.GROUP_UID,
               s.FACTORY_UID,
               s.FUNCTION_UID,
               s.IS_OPEN,
               s.ACCOUNT,
               SYSDATE,
               s.ACCOUNT,
               SYSDATE)
WHEN MATCHED
THEN
   UPDATE SET
      t.IS_OPEN = s.IS_OPEN, t.UP_USER = s.ACCOUNT, t.UP_DATE = SYSDATE
MERGE INTO ACCOUNT_GROUPS t
     USING (SELECT C.ACCOUNT, :GROUP_UID GROUP_UID, :ACCOUNT_UID ACCOUNT_UID
              FROM ACCOUNT_TOKEN A, ACCOUNTS C, GROUP_LIST D
             WHERE     A.ACCESS_TOKEN = :ACCESS_TOKEN
                   AND EXPIRATION_DATE >= TRUNC (SYSDATE)
                   AND IS_EFFECTIVE = 'Y'
                   AND A.ACCOUNT_UID = C.ACCOUNT_UID
                   AND D.GROUP_UID = :GROUP_UID) s
        ON (t.GROUP_UID = s.GROUP_UID AND t.ACCOUNT_UID = s.ACCOUNT_UID)
WHEN NOT MATCHED
THEN
   INSERT     (ACCOUNT_UID,
               GROUP_UID,
               UP_USER,
               UP_DATE,
               CREATE_USER,
               CREATE_DATE)
       VALUES (s.ACCOUNT_UID,
               s.GROUP_UID,
               s.ACCOUNT,
               SYSDATE,
               s.ACCOUNT,
               SYSDATE)
WHEN MATCHED
THEN
   UPDATE SET t.UP_USER = s.ACCOUNT
   DELETE
           WHERE GROUP_UID = s.GROUP_UID AND ACCOUNT_UID = s.ACCOUNT_UID
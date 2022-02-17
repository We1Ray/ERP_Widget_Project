INSERT INTO ACCOUNT_AVAILABLE_SYSTEMS (ACCOUNT_UID,
                                       SYSTEM_UID,
                                       EXPIRATION_DATE,
                                       UP_USER,
                                       UP_DATE,
                                       CREATE_USER,
                                       CREATE_DATE)
   SELECT :ACCOUNT_UID,
          :SYSTEM_UID,
          TO_DATE ( :EXPIRATION_DATE, 'yyyy/mm/dd'),
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
INSERT INTO ACCOUNT_TOKEN (ACCOUNT_UID,
                           ACCESS_TOKEN,
                           SYSTEM_UID,
                           EXPIRATION_DATE,
                           IS_EFFECTIVE,
                           UP_USER,
                           CREATE_USER)
   SELECT ACCOUNT_UID,
          :ACCESS_TOKEN,
          :SYSTEM_UID,
          CASE
             WHEN :EXPIRATION_DATE IS NULL THEN TRUNC (SYSDATE) + 90
             ELSE TO_DATE ( :EXPIRATION_DATE, 'YYYY/MM/DD')
          END,
          NVL (UPPER ( :IS_EFFECTIVE), 'Y'),
          NVL ( :UP_USER, 'SYSTEM'),
          NVL ( :CREATE_USER, 'SYSTEM')
     FROM ACCOUNTS
    WHERE ACCOUNT = :LDAP_ID
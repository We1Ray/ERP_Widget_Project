SELECT ACCOUNT_UID,
       ACCOUNT,
       NAME,
       EMAIL,
       LOCKED
  FROM ACCOUNTS
 WHERE     (   UPPER (ACCOUNT) LIKE '%' || UPPER ( :Key) || '%'
            OR UPPER (NAME) LIKE '%' || UPPER ( :Key) || '%'
            OR UPPER (ACCOUNT_UID) LIKE
                  '%' || UPPER ( :Key) || '%')
       AND (ACCOUNT_UID = NVL ( :ACCOUNT_UID, ACCOUNT_UID))
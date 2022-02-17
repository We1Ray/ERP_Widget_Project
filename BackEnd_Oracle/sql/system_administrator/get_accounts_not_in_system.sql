SELECT ROWNUM ROW_NUM_ID,
       ACCOUNT_UID,
       ACCOUNT,
       NAME,
       EMAIL,
       LOCKED
  FROM ACCOUNTS
 WHERE     (   UPPER (ACCOUNT) LIKE
                  '%' || UPPER ( :account_not_in_system_KEY) || '%'
            OR UPPER (NAME) LIKE
                  '%' || UPPER ( :account_not_in_system_KEY) || '%'
            OR UPPER (ACCOUNT_UID) LIKE
                  '%' || UPPER ( :account_not_in_system_KEY) || '%')
       AND LOCKED = NVL ('N', '')
       AND ACCOUNT_UID NOT IN (SELECT ACCOUNT_UID
                                 FROM ACCOUNT_AVAILABLE_SYSTEMS
                                WHERE SYSTEM_UID = :SYSTEM_UID)
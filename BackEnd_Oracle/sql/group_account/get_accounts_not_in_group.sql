SELECT ROWNUM ROW_NUM_ID,
       ACCOUNT_UID,
       ACCOUNT,
       NAME
  FROM ACCOUNTS
 WHERE     ACCOUNT_UID NOT IN (SELECT ACCOUNT_UID
                                 FROM ACCOUNT_GROUPS
                                WHERE GROUP_UID = :GROUP_UID)
       AND (   UPPER (ACCOUNT) LIKE
                  '%' || UPPER ( :account_not_group_KEY) || '%'
            OR UPPER (NAME) LIKE
                  '%' || UPPER ( :account_not_group_KEY) || '%')
       AND (ACCOUNT_UID = NVL ( :account_not_group_ACCOUNT_UID, ACCOUNT_UID))
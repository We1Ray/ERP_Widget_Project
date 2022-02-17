SELECT *
  FROM (SELECT Y.*
          FROM SYSTEM_LIST Y
               INNER JOIN ACCOUNT_AVAILABLE_SYSTEMS X
                  ON Y.SYSTEM_UID = X.SYSTEM_UID
         WHERE     Y.ENABLED = 'Y'
               AND (   X.ACCOUNT_UID = :systemadmin_ACCOUNT_UID
                    OR X.ACCOUNT_UID =
                          (SELECT ACCOUNT_UID
                             FROM ACCOUNT_TOKEN
                            WHERE     ACCESS_TOKEN =
                                         :systemadmin_ACCESS_TOKEN
                                  AND EXPIRATION_DATE >= TRUNC (SYSDATE)
                                  AND IS_EFFECTIVE = 'Y'))
               AND NVL (X.EXPIRATION_DATE, TRUNC (SYSDATE)) >=
                      TRUNC (SYSDATE))
 WHERE     UPPER (SYSTEM_NAME) LIKE
              '%' || UPPER ( :systemadmin_SYSTEM_NAME) || '%'
       AND SYSTEM_TYPE = NVL ( :systemadmin_SYSTEM_TYPE, SYSTEM_TYPE)
       AND SYSTEM_UID = NVL ( :systemadmin_SYSTEM_UID, SYSTEM_UID)
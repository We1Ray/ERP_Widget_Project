  SELECT CASE WHEN (B.IS_OPEN > 0 AND A.ENABLED = 'Y') THEN 'Y' ELSE 'N' END
            IS_OPEN,
         C.PROGRAM_UID,
         C.SYSTEM_UID,
         C.PROGRAM_CODE,
         C.PROGRAM_NAME,
         A.FUNCTION_UID,
         A.FUNCTION_NAME,
         A.FUNCTION_DESC,
         A.FUNCTION_CODE
    FROM FUNCTION_LIST A
         LEFT JOIN (  SELECT A.FUNCTION_UID, SUM (IS_OPEN) IS_OPEN
                        FROM GROUP_FUNCTION_SETTING A
                             INNER JOIN
                             (    SELECT GROUP_UID
                                    FROM GROUP_LIST
                                   WHERE ENABLED = 'Y'
                              START WITH GROUP_UID IN (SELECT X.GROUP_UID
                                                         FROM ACCOUNT_GROUPS X
                                                              INNER JOIN
                                                              GROUP_LIST Y
                                                                 ON     Y.GROUP_UID =
                                                                           X.GROUP_UID
                                                                    AND Y.ENABLED =
                                                                           'Y'
                                                        WHERE    X.ACCOUNT_UID =
                                                                    :ACCOUNT_UID
                                                              OR X.ACCOUNT_UID =
                                                                    (SELECT ACCOUNT_UID
                                                                       FROM ACCOUNT_TOKEN
                                                                      WHERE     ACCESS_TOKEN =
                                                                                   :ACCESS_TOKEN
                                                                            AND EXPIRATION_DATE >=
                                                                                   TRUNC (
                                                                                      SYSDATE)
                                                                            AND IS_EFFECTIVE =
                                                                                   'Y'))
                              CONNECT BY GROUP_UID = PRIOR PARENT_GROUP_UID) B
                                ON A.GROUP_UID = B.GROUP_UID
                       WHERE A.FACTORY_UID = :FACTORY_UID
                    GROUP BY A.FUNCTION_UID) B
            ON A.FUNCTION_UID = B.FUNCTION_UID
         LEFT JOIN PROGRAM_LIST C ON C.PROGRAM_UID = A.PROGRAM_UID
   WHERE     A.SYSTEM_UID = :SYSTEM_UID
         AND C.PROGRAM_CODE = NVL ( :PROGRAM_CODE, C.PROGRAM_CODE)
ORDER BY C.NODE_LEVEL, C.SEQ, A.SEQ
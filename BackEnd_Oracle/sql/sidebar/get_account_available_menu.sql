  SELECT CASE
            WHEN (B.IS_OPEN > 0 AND A.ENABLED = 'Y' AND C.ENABLED = 'Y')
            THEN
               'Y'
            ELSE
               'N'
         END
            IS_OPEN,
         C.PROGRAM_UID,
         C.SYSTEM_UID,
         C.PROGRAM_CODE,
         NVL (L.DISPLAY, C.PROGRAM_NAME) PROGRAM_NAME,
         C.I18N,
         C.ICON,
         C.PATH,
         C.PARENT_UID,
         C.IS_DIR,
         C.ENABLED,
         C.NODE_LEVEL,
         C.SEQ,
         C.UP_USER,
         C.UP_DATE,
         C.CREATE_USER,
         C.CREATE_DATE
    FROM FUNCTION_LIST A
         LEFT JOIN (  SELECT A.FUNCTION_UID, SUM (IS_OPEN) IS_OPEN
                        FROM GROUP_FUNCTION_SETTING A
                             INNER JOIN
                             (    SELECT GROUP_UID
                                    FROM GROUP_LIST
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
         LEFT JOIN UI_CAPTION_PROPERTIES L
            ON     LANGUAGE = NVL ( :LANGUAGE, 'TW')
               AND UPPER (L.SOURCE || '.' || L.WORD) = UPPER (C.I18N)
   WHERE     C.IS_DIR = 'Y'
         AND A.FUNCTION_CODE = 'read'
         AND A.SYSTEM_UID = :SYSTEM_UID
         AND A.PROGRAM_UID = NVL ( :PROGRAM_UID, A.PROGRAM_UID)
ORDER BY C.NODE_LEVEL, C.SEQ, A.SEQ
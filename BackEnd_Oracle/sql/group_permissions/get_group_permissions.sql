  SELECT NVL (D.EDITABLE, 'Y') EDITABLE,
         CASE
            WHEN (    (NVL (B.IS_OPEN, 0) + NVL (D.IS_OPEN, 0)) > 0 )
            THEN
               'Y'
            ELSE
               'N'
         END
            IS_OPEN,
         A.FUNCTION_UID,
         A.FUNCTION_NAME,
         A.FUNCTION_DESC,
         A.FUNCTION_CODE,
         A.IS_CORE,
         :GROUP_UID GROUP_UID
    FROM FUNCTION_LIST A
         LEFT JOIN
         (  SELECT A.FUNCTION_UID, SUM (IS_OPEN) IS_OPEN, 'Y' EDITABLE
              FROM GROUP_FUNCTION_SETTING A
             WHERE GROUP_UID = :GROUP_UID AND FACTORY_UID = :FACTORY_UID
          GROUP BY A.FUNCTION_UID) B
            ON A.FUNCTION_UID = B.FUNCTION_UID
         LEFT JOIN
         (  SELECT A.FUNCTION_UID,
                   SUM (IS_OPEN) IS_OPEN,
                   CASE WHEN SUM (IS_OPEN) > 0 THEN 'N' ELSE 'Y' END EDITABLE
              FROM GROUP_FUNCTION_SETTING A
                   INNER JOIN (    SELECT GROUP_UID,
                                          GROUP_NAME,
                                          IS_CORE,
                                          ENABLED,
                                          PARENT_GROUP_UID
                                     FROM GROUP_LIST
                                    WHERE GROUP_UID != :GROUP_UID
                               START WITH GROUP_UID = :GROUP_UID
                               CONNECT BY GROUP_UID = PRIOR PARENT_GROUP_UID) B
                      ON A.GROUP_UID = B.GROUP_UID
             WHERE A.FACTORY_UID = :FACTORY_UID
          GROUP BY A.FUNCTION_UID) D
            ON A.FUNCTION_UID = D.FUNCTION_UID AND D.IS_OPEN > 0
         LEFT JOIN PROGRAM_LIST C ON C.PROGRAM_UID = A.PROGRAM_UID
   WHERE     A.SYSTEM_UID = NVL ( :SYSTEM_UID, A.SYSTEM_UID)
         AND A.PROGRAM_UID = NVL ( :PROGRAM_UID, A.PROGRAM_UID)
         AND 1 = NVL2 ( :FACTORY_UID, 1, 0)
ORDER BY C.NODE_LEVEL, C.SEQ, A.SEQ
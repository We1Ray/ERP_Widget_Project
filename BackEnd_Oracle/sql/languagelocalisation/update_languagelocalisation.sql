MERGE INTO UI_CAPTION_PROPERTIES t
     USING (SELECT C.ACCOUNT,
                   B.LANGUAGE,
                   B.SOURCE,
                   B.WORD
              FROM ACCOUNT_TOKEN A, UI_CAPTION_PROPERTIES B, ACCOUNTS C
             WHERE     A.ACCESS_TOKEN = :ACCESS_TOKEN
                   AND EXPIRATION_DATE >= TRUNC (SYSDATE)
                   AND IS_EFFECTIVE = 'Y'
                   AND B.LANGUAGE = :LANGUAGE
                   AND B.SOURCE = :SOURCE
                   AND B.WORD = :WORD
                   AND A.ACCOUNT_UID = C.ACCOUNT_UID) s
        ON (    t.LANGUAGE = s.LANGUAGE
            AND t.SOURCE = s.SOURCE
            AND t.WORD = s.WORD)
WHEN MATCHED
THEN
   UPDATE SET DISPLAY = :DISPLAY, UP_DATE = SYSDATE, UP_USER = S.ACCOUNT
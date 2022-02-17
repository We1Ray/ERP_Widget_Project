MERGE INTO UI_CAPTION_PROPERTIES t
     USING (SELECT C.ACCOUNT,
                   :LANGUAGE LANGUAGE,
                   :SOURCE SOURCE,
                   :WORD WORD
              FROM ACCOUNT_TOKEN A, ACCOUNTS C
             WHERE     A.ACCESS_TOKEN = :ACCESS_TOKEN
                   AND EXPIRATION_DATE >= TRUNC (SYSDATE)
                   AND IS_EFFECTIVE = 'Y'
                   AND A.ACCOUNT_UID = C.ACCOUNT_UID) s
        ON (    t.LANGUAGE = s.LANGUAGE
            AND t.SOURCE = s.SOURCE
            AND t.WORD = s.WORD)
WHEN NOT MATCHED
THEN
   INSERT     (LANGUAGE,
               SOURCE,
               WORD,
               DISPLAY,
               UP_USER,
               UP_DATE,
               CREATE_USER,
               CREATE_DATE)
       VALUES ( :LANGUAGE,
               :SOURCE,
               :WORD,
               :DISPLAY,
               s.ACCOUNT,
               SYSDATE,
               s.ACCOUNT,
               SYSDATE)
WHEN MATCHED
THEN
   UPDATE SET DISPLAY = :DISPLAY, UP_DATE = SYSDATE, UP_USER = s.ACCOUNT
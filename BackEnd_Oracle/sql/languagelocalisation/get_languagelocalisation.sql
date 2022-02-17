  SELECT ROWNUM ROW_NUM_ID, A.*
    FROM UI_CAPTION_PROPERTIES A
   WHERE     (   WORD LIKE '%' || NVL ( :languagelocalisation_KEY, WORD) || '%'
              OR DISPLAY LIKE
                    '%' || NVL ( :languagelocalisation_KEY, DISPLAY) || '%')
         AND (   :languagelocalisation_SOURCE IS NULL
              OR FIND_STRING_TAG ( :languagelocalisation_SOURCE, SOURCE, ';') >
                    0)
         AND (   :languagelocalisation_LANGUAGE IS NULL
              OR FIND_STRING_TAG ( :languagelocalisation_LANGUAGE,
                                  LANGUAGE,
                                  ';') > 0)
         AND (   :languagelocalisation_UP_DATE1 IS NULL
              OR TO_DATE (TO_CHAR (UP_DATE, 'yyyy-MM-dd'), 'yyyy-MM-dd') >=
                    TO_DATE ( :languagelocalisation_UP_DATE1, 'YYYY/MM/DD'))
         AND (   :languagelocalisation_UP_DATE2 IS NULL
              OR TO_DATE (TO_CHAR (UP_DATE, 'yyyy-MM-dd'), 'yyyy-MM-dd') <=
                    TO_DATE ( :languagelocalisation_UP_DATE2, 'YYYY/MM/DD'))
ORDER BY SOURCE, WORD, LANGUAGE
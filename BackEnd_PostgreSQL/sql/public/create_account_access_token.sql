INSERT INTO ACCOUNT_TOKEN (ACCOUNT_UID,
                           ACCESS_TOKEN,
                           SYSTEM_UID,
                           EXPIRATION_DATE,
                           IS_EFFECTIVE,
                           UP_USER,
                           CREATE_USER)
   SELECT ACCOUNT_UID,
            $1::VARCHAR,
            $2::VARCHAR,
          CASE
             WHEN $3::VARCHAR IS NULL THEN  now() + interval '30 day'
             ELSE to_timestamp ( $3::VARCHAR, 'YYYY/MM/DD')
          END,
          coalesce (UPPER ( $4::VARCHAR), 'Y'),
          coalesce ( $5::VARCHAR, 'SYSTEM'),
          coalesce ( $6::VARCHAR, 'SYSTEM')
     FROM ACCOUNTS
    WHERE ACCOUNT = $7::VARCHAR
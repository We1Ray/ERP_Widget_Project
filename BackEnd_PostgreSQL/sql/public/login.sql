SELECT
    *
FROM
    accounts
WHERE
        email = $1::VARCHAR
    AND password = $2::VARCHAR
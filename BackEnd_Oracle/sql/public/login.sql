SELECT
    *
FROM
    accounts
WHERE
        email = :EMAIL
    AND password = :PASSWORD
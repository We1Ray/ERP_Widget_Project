with cte as(
	select
		C.ACCOUNT,
		B.*
	from
		ACCOUNT_TOKEN A,
		FUNCTION_LIST B,
		ACCOUNTS C
	where
		A.ACCESS_TOKEN = $1::varchar
		and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
		and IS_EFFECTIVE = 'Y'
		and B.FUNCTION_UID = $2::varchar
		and A.ACCOUNT_UID = C.ACCOUNT_UID
) update
	FUNCTION_LIST t
set
	FUNCTION_NAME = $3::varchar,
	FUNCTION_DESC = $4::varchar,
	FUNCTION_CODE = $5::varchar,
	IS_CORE = $6::varchar,
	ENABLED = $7::varchar,
	SEQ = $8::SEQ,
	UP_USER = S.ACCOUNT,
	UP_DATE = now()
from
	cte s
where
	t.FUNCTION_UID = s.FUNCTION_UID
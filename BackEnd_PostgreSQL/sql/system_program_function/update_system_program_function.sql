with cte as(
	select
		C.ACCOUNT,
		B.*
	from
		ACCOUNT_TOKEN A,
		FUNCTION_LIST B,
		ACCOUNTS C
	where
		A.ACCESS_TOKEN = ${access_token}
		and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
		and IS_EFFECTIVE = 'Y'
		and B.FUNCTION_UID = ${function_uid}
		and A.ACCOUNT_UID = C.ACCOUNT_UID
) update
	FUNCTION_LIST t
set
	FUNCTION_NAME = ${function_name},
	FUNCTION_DESC = ${function_desc},
	FUNCTION_CODE = ${function_code},
	IS_CORE = ${is_core},
	ENABLED = ${enabled},
	SEQ = ${seq}::integer,
	UP_USER = S.ACCOUNT,
	UP_DATE = now()
from
	cte s
where
	t.FUNCTION_UID = s.FUNCTION_UID
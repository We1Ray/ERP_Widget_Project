with cte as(
	select
		C.ACCOUNT,
		B.SYSTEM_UID
	from
		ACCOUNT_TOKEN A,
		SYSTEM_LIST B,
		ACCOUNTS C
	where
		A.ACCESS_TOKEN = $1::varchar
		and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
		and IS_EFFECTIVE = 'Y'
		and B.SYSTEM_UID = $2::varchar
		and A.ACCOUNT_UID = C.ACCOUNT_UID
) update
	SYSTEM_LIST as t
set
	SYSTEM_NAME = $3::varchar,
	SYSTEM_DESC = $4::varchar,
	ENABLED = $5::varchar,
	SYSTEM_TYPE = $6::varchar,
	UP_DATE = now(),
	UP_USER = S.ACCOUNT
from
	cte as s
where
	t.SYSTEM_UID = s.SYSTEM_UID
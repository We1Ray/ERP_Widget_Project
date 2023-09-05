with cte as(
	select
		C.ACCOUNT,
		B.SYSTEM_UID
	from
		ACCOUNT_TOKEN A,
		SYSTEM_LIST B,
		ACCOUNTS C
	where
		A.ACCESS_TOKEN = ${access_token}
		and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
		and IS_EFFECTIVE = 'Y'
		and B.SYSTEM_UID = ${system_uid}
		and A.ACCOUNT_UID = C.ACCOUNT_UID
) update
	SYSTEM_LIST as t
set
	SYSTEM_NAME = ${system_name},
	SYSTEM_DESC = ${system_desc},
	ENABLED = ${enabled},
	SYSTEM_TYPE = ${system_type},
	UP_DATE = now(),
	UP_USER = S.ACCOUNT
from
	cte as s
where
	t.SYSTEM_UID = s.SYSTEM_UID
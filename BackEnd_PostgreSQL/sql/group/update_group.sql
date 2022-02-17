with cte as(
	select
		C.ACCOUNT,
		B.*
	from
		ACCOUNT_TOKEN A,
		GROUP_LIST B,
		ACCOUNTS C
	where
		A.ACCESS_TOKEN = $1::varchar
		and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
		and IS_EFFECTIVE = 'Y'
		and B.GROUP_UID = $2::varchar
		and A.ACCOUNT_UID = C.ACCOUNT_UID
) update
	GROUP_LIST t
set
	GROUP_NAME = $3::varchar,
	IS_CORE = $4::varchar,
	ENABLED = $5::varchar,
	PARENT_GROUP_UID = $6::varchar,
	UP_USER = cte.ACCOUNT,
	UP_DATE = now()
from
	cte
where
	t.GROUP_UID = cte.GROUP_UID
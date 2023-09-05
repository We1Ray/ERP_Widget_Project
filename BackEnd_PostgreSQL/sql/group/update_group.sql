with cte as(
	select
		C.ACCOUNT,
		B.*
	from
		ACCOUNT_TOKEN A,
		GROUP_LIST B,
		ACCOUNTS C
	where
		A.ACCESS_TOKEN = ${access_token}
		and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
		and IS_EFFECTIVE = 'Y'
		and B.GROUP_UID = ${group_uid}
		and A.ACCOUNT_UID = C.ACCOUNT_UID
) update
	GROUP_LIST t
set
	GROUP_NAME = ${group_name},
	IS_CORE = ${is_core},
	ENABLED = ${enabled},
	PARENT_GROUP_UID = ${parent_group_uid},
	UP_USER = cte.ACCOUNT,
	UP_DATE = now()
from
	cte
where
	t.GROUP_UID = cte.GROUP_UID
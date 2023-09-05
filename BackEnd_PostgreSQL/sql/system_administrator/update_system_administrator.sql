update
	ACCOUNT_AVAILABLE_SYSTEMS
set
	EXPIRATION_DATE = to_timestamp(
		${expiration_date},
		'YYYY/MM/DD'
	),
	UP_DATE = now(),
	UP_USER =(
		select
			C.ACCOUNT
		from
			ACCOUNT_TOKEN A,
			ACCOUNTS C
		where
			A.ACCESS_TOKEN = ${access_token}
			and a.EXPIRATION_DATE >= DATE_TRUNC(
				'day',
				now()
			)
			and A.IS_EFFECTIVE = 'Y'
			and A.ACCOUNT_UID = C.ACCOUNT_UID
	)
where
	(
		select
			C.ACCOUNT
		from
			ACCOUNT_TOKEN A,
			ACCOUNTS C
		where
			A.ACCESS_TOKEN = ${access_token}
			and a.EXPIRATION_DATE >= DATE_TRUNC(
				'day',
				now()
			)
			and A.IS_EFFECTIVE = 'Y'
			and A.ACCOUNT_UID = C.ACCOUNT_UID
	) is not null
	and SYSTEM_UID = ${system_uid}
	and ACCOUNT_UID = ${account_uid}
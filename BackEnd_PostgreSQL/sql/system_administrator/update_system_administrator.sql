update
	ACCOUNT_AVAILABLE_SYSTEMS
set
	EXPIRATION_DATE = to_timestamp(
		$1::varchar,
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
			A.ACCESS_TOKEN = $2::varchar
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
			A.ACCESS_TOKEN = $2::varchar
			and a.EXPIRATION_DATE >= DATE_TRUNC(
				'day',
				now()
			)
			and A.IS_EFFECTIVE = 'Y'
			and A.ACCOUNT_UID = C.ACCOUNT_UID
	) is not null
	and SYSTEM_UID = $3::varchar
	and ACCOUNT_UID = $4::varchar
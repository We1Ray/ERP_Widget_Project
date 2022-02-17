with cte as(
	select
		$1::varchar,
		$2::varchar,
		TO_DATE(
			$3::varchar,
			'yyyy/mm/dd'
		),
		(
			select
				C.ACCOUNT
			from
				ACCOUNT_TOKEN A,
				ACCOUNTS C
			where
				A.ACCESS_TOKEN = $4::varchar
				and a.EXPIRATION_DATE >= DATE_TRUNC(
					'day',
					now()
				)
				and A.IS_EFFECTIVE = 'Y'
				and A.ACCOUNT_UID = C.ACCOUNT_UID
		) UP_USER,
		now(),
		(
			select
				C.ACCOUNT
			from
				ACCOUNT_TOKEN A,
				ACCOUNTS C
			where
				A.ACCESS_TOKEN = $4::varchar
				and a.EXPIRATION_DATE >= DATE_TRUNC(
					'day',
					now()
				)
				and A.IS_EFFECTIVE = 'Y'
				and A.ACCOUNT_UID = C.ACCOUNT_UID
		) CREATE_USER,
		now()
) insert
	into
		ACCOUNT_AVAILABLE_SYSTEMS(
			ACCOUNT_UID,
			SYSTEM_UID,
			EXPIRATION_DATE,
			UP_USER,
			UP_DATE,
			CREATE_USER,
			CREATE_DATE
		) select
			*
		from
			cte
		where
			exists(
				select
					C.ACCOUNT
				from
					ACCOUNT_TOKEN A,
					ACCOUNTS C
				where
					A.ACCESS_TOKEN = $4::varchar
					and a.EXPIRATION_DATE >= DATE_TRUNC(
						'day',
						now()
					)
					and A.IS_EFFECTIVE = 'Y'
					and A.ACCOUNT_UID = C.ACCOUNT_UID
			)
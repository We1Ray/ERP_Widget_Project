with cte as(
	select
		$1::varchar,
		$2::varchar,
		$3::varchar,
		$4::varchar,
		$5::varchar,
		$6::varchar,
		(
			select
				C.ACCOUNT
			from
				ACCOUNT_TOKEN A,
				ACCOUNTS C
			where
				A.ACCESS_TOKEN = $7::varchar
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
				A.ACCESS_TOKEN = $7::varchar
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
		SYSTEM_LIST(
			SYSTEM_UID,
			SYSTEM_NAME,
			SYSTEM_DESC,
			SECRET_KEY,
			ENABLED,
			SYSTEM_TYPE,
			UP_USER,
			UP_DATE,
			CREATE_USER,
			CREATE_DATE
		) select
			*
		from
			cte
		where
			1 = 1
			and exists(
				select
					C.ACCOUNT
				from
					ACCOUNT_TOKEN A,
					ACCOUNTS C
				where
					A.ACCESS_TOKEN = $7::varchar
					and a.EXPIRATION_DATE >= DATE_TRUNC(
						'day',
						now()
					)
					and A.IS_EFFECTIVE = 'Y'
					and A.ACCOUNT_UID = C.ACCOUNT_UID
			)
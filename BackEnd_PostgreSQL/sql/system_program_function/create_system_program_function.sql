with cte as(
	select
		$1::varchar,
		$2::varchar,
		$3::varchar,
		$4::varchar,
		$5::varchar,
		$6::varchar,
		$7::varchar,
		$8::varchar,
		$9::integer,
		(
			select
				C.ACCOUNT
			from
				ACCOUNT_TOKEN A,
				ACCOUNTS C
			where
				A.ACCESS_TOKEN = $10::varchar
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
				A.ACCESS_TOKEN = $10::varchar
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
		FUNCTION_LIST(
			SYSTEM_UID,
			PROGRAM_UID,
			FUNCTION_UID,
			FUNCTION_CODE,
			FUNCTION_NAME,
			FUNCTION_DESC,
			IS_CORE,
			ENABLED,
			SEQ,
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
					A.ACCESS_TOKEN = $10::varchar
					and a.EXPIRATION_DATE >= DATE_TRUNC(
						'day',
						now()
					)
					and A.IS_EFFECTIVE = 'Y'
					and A.ACCOUNT_UID = C.ACCOUNT_UID
			)
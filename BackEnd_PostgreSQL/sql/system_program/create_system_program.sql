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
		case
			when $9::varchar is not null then $9::varchar when $7::varchar is null then 'Y'
			else 'N'
		end IS_DIR,
		$10::varchar,
		$11::integer,
		$12::integer,
		(
			select
				C.ACCOUNT
			from
				ACCOUNT_TOKEN A,
				ACCOUNTS C
			where
				A.ACCESS_TOKEN = $13::varchar
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
				A.ACCESS_TOKEN = $13::varchar
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
		PROGRAM_LIST(
			PROGRAM_UID,
			SYSTEM_UID,
			PROGRAM_CODE,
			PROGRAM_NAME,
			I18N,
			ICON,
			path,
			PARENT_UID,
			IS_DIR,
			ENABLED,
			NODE_LEVEL,
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
					A.ACCESS_TOKEN = $13::varchar
					and a.EXPIRATION_DATE >= DATE_TRUNC(
						'day',
						now()
					)
					and A.IS_EFFECTIVE = 'Y'
					and A.ACCOUNT_UID = C.ACCOUNT_UID
			)
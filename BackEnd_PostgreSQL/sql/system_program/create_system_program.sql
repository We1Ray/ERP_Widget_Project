with cte as(
	select
		${program_uid},
		${system_uid},
		${program_code},
		${program_name},
		${i18n},
		${icon},
		${path},
		${parent_uid},
		case
			when ${is_dir} is not null then ${is_dir} when ${path} is null then 'Y'
			else 'N'
		end IS_DIR,
		${enabled},
		${node_level}::integer,
		${seq}::integer,
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
		) UP_USER,
		now(),
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
					A.ACCESS_TOKEN = ${access_token}
					and a.EXPIRATION_DATE >= DATE_TRUNC(
						'day',
						now()
					)
					and A.IS_EFFECTIVE = 'Y'
					and A.ACCOUNT_UID = C.ACCOUNT_UID
			)
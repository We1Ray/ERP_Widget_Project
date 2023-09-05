insert
	into
		ACCOUNT_AVAILABLE_SYSTEMS(
			ACCOUNT_UID,
			SYSTEM_UID,
			UP_USER,
			CREATE_USER
		) select
			C.ACCOUNT_UID,
			${system_uid},
			C.ACCOUNT,
			C.ACCOUNT
		from
			ACCOUNT_TOKEN A,
			ACCOUNTS C
		where
			A.ACCESS_TOKEN =${access_token}
			and a.EXPIRATION_DATE >= DATE_TRUNC(
				'day',
				now()
			)
			and A.IS_EFFECTIVE = 'Y'
			and A.ACCOUNT_UID = C.ACCOUNT_UID
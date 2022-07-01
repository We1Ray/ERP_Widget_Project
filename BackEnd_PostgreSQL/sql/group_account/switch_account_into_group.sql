with cte as(
	insert
		into
			ACCOUNT_GROUPS(
				select
					${account_uid} as ACCOUNT_UID,
					${group_uid} as GROUP_UID,
					C.ACCOUNT as up_user,
					now() as up_date,
					C.ACCOUNT as create_user,
					now() as create_date
				from
					ACCOUNT_TOKEN A,
					ACCOUNTS C,
					GROUP_LIST D
				where
					A.ACCESS_TOKEN = ${access_token}
					and EXPIRATION_DATE >= DATE_TRUNC(
						'day',
						now()
					)
					and IS_EFFECTIVE = 'Y'
					and A.ACCOUNT_UID = C.ACCOUNT_UID
					and D.GROUP_UID = ${group_uid}
			) on
			conflict(
				ACCOUNT_UID,
				GROUP_UID
			) do nothing returning*
) delete
from
	ACCOUNT_GROUPS
where
	concat( ACCOUNT_UID, '/', GROUP_UID ) in(
		select
			concat( a.ACCOUNT_UID, '/', a.GROUP_UID )
		from
			(
				select
					null as ACCOUNT_UID,
					null as GROUP_UID
				where
					exists(
						select
							1
						from
							cte
					)
			union all select
					ACCOUNT_UID,
					GROUP_UID
				from
					ACCOUNT_GROUPS
				where
					ACCOUNT_UID = ${account_uid}
					and GROUP_UID = ${group_uid}
					and not exists(
						select
							1
						from
							cte
					)
			) a
	)
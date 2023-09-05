with cte_dual as(
	select
		C.ACCOUNT,
		case
			when ${is_open} = 'Y' then 1
			else 0
		end IS_OPEN,
		${group_uid} GROUP_UID,
		${function_uid} FUNCTION_UID,
		${factory_uid} FACTORY_UID
	from
		ACCOUNT_TOKEN A,
		ACCOUNTS C
	where
		A.ACCESS_TOKEN = ${access_token}
		and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
		and IS_EFFECTIVE = 'Y'
		and A.ACCOUNT_UID = C.ACCOUNT_UID
		and ${group_uid} is not null
		and ${function_uid} is not null
		and ${editable} = 'Y'
),
cte_update as(
	update
		GROUP_FUNCTION_SETTING as a
	set
		IS_OPEN = b.IS_OPEN,
		UP_USER = b.ACCOUNT,
		UP_DATE = now()
	from
		cte_dual as b
	where
		b.GROUP_UID = a.GROUP_UID
		and b.FUNCTION_UID = a.FUNCTION_UID
		and b.FACTORY_UID = a.FACTORY_UID returning b.*
) insert
	into
		GROUP_FUNCTION_SETTING(
			GROUP_UID,
			FACTORY_UID,
			FUNCTION_UID,
			IS_OPEN,
			UP_USER,
			UP_DATE,
			CREATE_USER,
			CREATE_DATE
		) select
			d.GROUP_UID,
			d.FACTORY_UID,
			d.FUNCTION_UID,
			d.IS_OPEN,
			d.ACCOUNT,
			now(),
			d.ACCOUNT,
			now()
		from
			cte_dual as d
		where
			not exists(
				select
					*
				from
					cte_update as u,
					cte_dual as d
				where
					u.GROUP_UID = d.GROUP_UID
					and u.FUNCTION_UID = d.FUNCTION_UID
					and u.FACTORY_UID = d.FACTORY_UID
			)
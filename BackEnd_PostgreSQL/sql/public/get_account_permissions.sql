with recursive CTE as(
select
		*
from
		GROUP_LIST
where
		ENABLED = 'Y'
	and GROUP_UID in(
	select
				X.GROUP_UID
	from
				ACCOUNT_GROUPS X
	inner join GROUP_LIST Y on
				Y.GROUP_UID = X.GROUP_UID
		and Y.ENABLED = 'Y'
	where
				X.ACCOUNT_UID = ${account_uid}
		or X.ACCOUNT_UID =(
		select
						ACCOUNT_UID
		from
						ACCOUNT_TOKEN
		where
						ACCESS_TOKEN = ${access_token}
			and EXPIRATION_DATE >= DATE_TRUNC(
							'day',
							now()
						)
				and IS_EFFECTIVE = 'Y'
				)
		)
union all
select
		t.*
from
		cte c
join GROUP_LIST t on
		c.PARENT_GROUP_UID = t.GROUP_UID
)
select
	case
		when(
			B.IS_OPEN > 0
			and A.ENABLED = 'Y'
		) then 'Y'
		else 'N'
	end IS_OPEN,
	C.PROGRAM_UID,
	C.SYSTEM_UID,
	C.PROGRAM_CODE,
	C.PROGRAM_NAME,
	A.FUNCTION_UID,
	A.FUNCTION_NAME,
	A.FUNCTION_DESC,
	A.FUNCTION_CODE
from
	FUNCTION_LIST A
left join(
	select
			A.FUNCTION_UID,
			sum( IS_OPEN::integer ) IS_OPEN
	from
			GROUP_FUNCTION_SETTING A
	inner join CTE B on
			A.GROUP_UID = B.GROUP_UID
	where
			A.FACTORY_UID = ${factory_uid}
	group by
			A.FUNCTION_UID
	) B on
	A.FUNCTION_UID = B.FUNCTION_UID
left join PROGRAM_LIST C on
	C.PROGRAM_UID = A.PROGRAM_UID
where
	A.SYSTEM_UID = ${system_uid}
	and C.PROGRAM_CODE = coalesce(
		${program_code},
		C.PROGRAM_CODE
	)
order by
	C.NODE_LEVEL,
	C.SEQ,
	A.SEQ
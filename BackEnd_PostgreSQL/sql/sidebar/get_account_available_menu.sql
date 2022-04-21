with recursive CTE as(
	select
		GROUP_UID,
		PARENT_GROUP_UID,
		1 as level
	from
		GROUP_LIST
	where
		GROUP_UID in(
			select
				X.GROUP_UID
			from
				ACCOUNT_GROUPS X inner join GROUP_LIST Y on
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
union all select
		t.GROUP_UID,
		t.PARENT_GROUP_UID,
		c.level + 1
	from
		cte c join GROUP_LIST t on
		c.PARENT_GROUP_UID = t.GROUP_UID
) select
	case
		when(
			B.IS_OPEN > 0
			and A.ENABLED = 'Y'
			and C.ENABLED = 'Y'
		) then 'Y'
		else 'N'
	end IS_OPEN,
	C.PROGRAM_UID,
	C.SYSTEM_UID,
	C.PROGRAM_CODE,
	coalesce(
		L.DISPLAY,
		C.PROGRAM_NAME
	) PROGRAM_NAME,
	C.I18N,
	C.ICON,
	C.PATH,
	C.PARENT_UID,
	C.IS_DIR,
	C.ENABLED,
	C.NODE_LEVEL,
	C.SEQ,
	C.UP_USER,
	C.UP_DATE,
	C.CREATE_USER,
	C.CREATE_DATE
from
	FUNCTION_LIST A left join(
		select
			A.FUNCTION_UID,
			sum( IS_OPEN::integer ) IS_OPEN
		from
			GROUP_FUNCTION_SETTING A inner join(
				select
					*
				from
					cte
			) B on
			A.GROUP_UID = B.GROUP_UID
		where
			A.FACTORY_UID = ${factory_uid}
		group by
			A.FUNCTION_UID
	) B on
	A.FUNCTION_UID = B.FUNCTION_UID left join PROGRAM_LIST C on
	C.PROGRAM_UID = A.PROGRAM_UID left join UI_CAPTION_PROPERTIES L on
	LANGUAGE = coalesce(
		${language},
		'TW'
	)
	and upper( L.SOURCE || '.' || L.WORD )= upper( C.I18N )
where
	C.IS_DIR = 'Y'
	and A.FUNCTION_CODE = 'read'
	and A.SYSTEM_UID = ${system_uid}
	and A.PROGRAM_UID = coalesce(
		${program_uid},
		A.PROGRAM_UID
	)
order by
	C.NODE_LEVEL,
	C.SEQ,
	A.SEQ
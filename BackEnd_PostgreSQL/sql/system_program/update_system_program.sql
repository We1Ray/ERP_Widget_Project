with cte as(
	select
		C.ACCOUNT,
		B.*
	from
		ACCOUNT_TOKEN A,
		PROGRAM_LIST B,
		ACCOUNTS C
	where
		A.ACCESS_TOKEN = ${access_token}
		and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
		and IS_EFFECTIVE = 'Y'
		and B.PROGRAM_UID = ${program_uid}
		and A.ACCOUNT_UID = C.ACCOUNT_UID
) update
	PROGRAM_LIST t
set
	PROGRAM_CODE = coalesce(
		${program_code},
		s.PROGRAM_CODE
	),
	PROGRAM_NAME = ${program_name},
	I18N = ${i18n},
	ICON = ${icon},
	NODE_LEVEL = ${node_level},
    PARENT_UID = ${parent_uid},
	path = coalesce(
		${path},
		s.PATH
	),
	IS_DIR = case
		when ${is_dir} is not null then ${is_dir}
		when coalesce(
			${path},
			s.PATH
		) is null then 'Y'
		else 'N'
	end,
	SEQ = ${seq}::integer,
	ENABLED = ${enabled},
	UP_USER = S.ACCOUNT,
	UP_DATE = now()
from
	cte s
where
	t.PROGRAM_UID = s.PROGRAM_UID
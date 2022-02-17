with cte as(
	select
		C.ACCOUNT,
		B.*
	from
		ACCOUNT_TOKEN A,
		PROGRAM_LIST B,
		ACCOUNTS C
	where
		A.ACCESS_TOKEN = $1::varchar
		and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
		and IS_EFFECTIVE = 'Y'
		and B.PROGRAM_UID = $2::varchar
		and A.ACCOUNT_UID = C.ACCOUNT_UID
) update
	PROGRAM_LIST t
set
	PROGRAM_CODE = coalesce(
		$3::varchar,
		s.PROGRAM_CODE
	),
	PROGRAM_NAME = $4::varchar,
	I18N = $5::varchar,
	ICON = $6::varchar,
	path = coalesce(
		$7::varchar,
		s.PATH
	),
	IS_DIR = case
		when $8::varchar is not null then $8::varchar
		when coalesce(
			$7::varchar,
			s.PATH
		) is null then 'Y'
		else 'N'
	end,
	SEQ = $9::integer,
	ENABLED = $10::varchar,
	UP_USER = S.ACCOUNT,
	UP_DATE = now()
from
	cte s
where
	t.PROGRAM_UID = s.PROGRAM_UID
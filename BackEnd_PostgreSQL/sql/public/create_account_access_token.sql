insert
	into
	ACCOUNT_TOKEN (ACCOUNT_UID,
	ACCESS_TOKEN,
	SYSTEM_UID,
	EXPIRATION_DATE,
	IS_EFFECTIVE,
	UP_USER,
	UP_DATE,
	CREATE_USER,
	CREATE_DATE,
	ismobile)
   select
	ACCOUNT_UID,
	${access_token},
	${system_uid},
	case
		when ${expiration_date} is null then now() + interval '30 day'
		else to_timestamp ( ${expiration_date},
		'YYYY/MM/DD')
	end,
	coalesce (UPPER (${is_effective}),
	'Y'),
	coalesce ( ${up_user},
	'SYSTEM'),
	now(),
	coalesce ( ${create_user},
	'SYSTEM'),
	now(),
	${isMobile}
from
	ACCOUNTS
where
	ACCOUNT = ${ldap_id}
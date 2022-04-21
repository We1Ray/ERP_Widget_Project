select
	*
from
	(
		select
			Y.*
		from
			SYSTEM_LIST as Y inner join ACCOUNT_AVAILABLE_SYSTEMS as X on
			Y.SYSTEM_UID = X.SYSTEM_UID
		where
			Y.ENABLED = 'Y'
			and(
				X.ACCOUNT_UID = ${systemadmin_ACCOUNT_UID}
				or X.ACCOUNT_UID =(
					select
						ACCOUNT_UID
					from
						ACCOUNT_TOKEN
					where
						ACCESS_TOKEN = ${systemadmin_ACCESS_TOKEN}
						and EXPIRATION_DATE >= DATE_TRUNC(
							'day',
							now()
						)
						and IS_EFFECTIVE = 'Y'
				)
			)
			and coalesce(
				X.EXPIRATION_DATE,
				DATE_TRUNC(
					'day',
					now()
				)
			)>= DATE_TRUNC(
				'day',
				now()
			)
	) A
where
	upper( SYSTEM_NAME ) like concat( '%', upper( ${systemadmin_SYSTEM_NAME} ), '%' )
	and SYSTEM_TYPE = coalesce(
		${systemadmin_SYSTEM_TYPE},
		SYSTEM_TYPE
	)
	and SYSTEM_UID = coalesce(
		${systemadmin_SYSTEM_UID},
		SYSTEM_UID
	)
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
				X.ACCOUNT_UID = $1::varchar
				or X.ACCOUNT_UID =(
					select
						ACCOUNT_UID
					from
						ACCOUNT_TOKEN
					where
						ACCESS_TOKEN = $2::varchar
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
	upper( SYSTEM_NAME ) like concat( '%', upper( $3::varchar ), '%' )
	and SYSTEM_TYPE = coalesce(
		$4::varchar,
		SYSTEM_TYPE
	)
	and SYSTEM_UID = coalesce(
		$5::varchar,
		SYSTEM_UID
	)
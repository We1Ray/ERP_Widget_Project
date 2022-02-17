select
	row_number() over() as ROW_NUM_ID,
	ACCOUNT_UID,
	ACCOUNT,
	name
from
	ACCOUNTS
where
	ACCOUNT_UID not in(
		select
			ACCOUNT_UID
		from
			ACCOUNT_GROUPS
		where
			GROUP_UID = $1::varchar
	)
	and(
		upper( ACCOUNT ) like '%' || upper( coalesce( $2::varchar, '' ))|| '%'
		or upper( name ) like '%' || upper( coalesce( $2::varchar, '' ))|| '%'
	)
	and(
		ACCOUNT_UID = coalesce(
			$3::varchar,
			ACCOUNT_UID
		)
	)
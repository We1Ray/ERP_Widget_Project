select
	row_number() over() as ROW_NUM_ID,
	ACCOUNT_UID,
	ACCOUNT,
	name,
	EMAIL,
	locked
from
	ACCOUNTS
where
	(
		upper( ACCOUNT ) like concat( '%', upper( $1::varchar ), '%' )
		or upper( name ) like concat( '%', upper( $1::varchar ), '%' )
		or upper( ACCOUNT_UID ) like concat( '%', upper( $1::varchar ), '%' )
	)
	and locked = coalesce(
		'N',
		''
	)
	and ACCOUNT_UID not in(
		select
			ACCOUNT_UID
		from
			ACCOUNT_AVAILABLE_SYSTEMS
		where
			SYSTEM_UID = $2::varchar
	)
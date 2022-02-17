select
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
	and(
		ACCOUNT_UID = coalesce(
			$2::varchar,
			ACCOUNT_UID
		)
	)
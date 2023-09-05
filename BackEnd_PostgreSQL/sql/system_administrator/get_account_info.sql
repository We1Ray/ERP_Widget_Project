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
		upper( ACCOUNT ) like concat( '%', upper( ${key} ), '%' )
		or upper( name ) like concat( '%', upper( ${key} ), '%' )
		or upper( ACCOUNT_UID ) like concat( '%', upper( ${key} ), '%' )
	)
	and(
		ACCOUNT_UID = coalesce(
			${account_uid},
			ACCOUNT_UID
		)
	)
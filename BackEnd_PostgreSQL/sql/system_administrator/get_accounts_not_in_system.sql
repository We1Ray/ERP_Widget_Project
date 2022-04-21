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
		upper( ACCOUNT ) like concat( '%', upper( ${account_not_in_system_KEY} ), '%' )
		or upper( name ) like concat( '%', upper( ${account_not_in_system_KEY} ), '%' )
		or upper( ACCOUNT_UID ) like concat( '%', upper( ${account_not_in_system_KEY} ), '%' )
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
			SYSTEM_UID = ${system_uid}
	)
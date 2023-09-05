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
			GROUP_UID = ${group_uid}
	)
	and(
		upper( ACCOUNT ) like '%' || upper( coalesce( ${account_not_group_KEY}, '' ))|| '%'
		or upper( name ) like '%' || upper( coalesce( ${account_not_group_KEY}, '' ))|| '%'
	)
	and(
		ACCOUNT_UID = coalesce(
			${account_not_group_ACCOUNT_UID},
			ACCOUNT_UID
		)
	)
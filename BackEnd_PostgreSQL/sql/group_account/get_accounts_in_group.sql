select
	row_number() over() as ROW_NUM_ID,
	A.GROUP_UID,
	B.ACCOUNT_UID,
	B.ACCOUNT,
	B.NAME
from
	ACCOUNT_GROUPS A inner join ACCOUNTS B on
	A.ACCOUNT_UID = B.ACCOUNT_UID
where
	A.GROUP_UID = $1::varchar
	and(
		upper( B.ACCOUNT ) like '%' || upper( coalesce( $2::varchar, '' ))|| '%'
		or upper( B.NAME ) like '%' || upper( coalesce( $2::varchar, '' ))|| '%'
	)
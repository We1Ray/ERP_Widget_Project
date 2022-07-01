select
	row_number() over() as ROW_NUM_ID,
	A.GROUP_UID,
	B.ACCOUNT_UID,
	B.ACCOUNT,
	B.NAME
from
	ACCOUNT_GROUPS A
inner join ACCOUNTS B on
	A.ACCOUNT_UID = B.ACCOUNT_UID
where
	A.GROUP_UID = ${group_account_GROUP_UID}
	and(
		upper(B.ACCOUNT) like '%' || upper( coalesce( ${group_account_SEARCH_VALUE}, '' ))|| '%'
		or upper(B.NAME) like '%' || upper( coalesce( ${group_account_SEARCH_VALUE}, '' ))|| '%'
	)
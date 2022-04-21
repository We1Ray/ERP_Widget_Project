select
	row_number() over() as ROW_NUM_ID,
	A.*
from
	ACCOUNTS A
where
	(${account} is null
		or (upper(account) like concat( '%', upper( ${account} ), '%' )))
	and(
		${account_uid} is null
		or(
			account_uid = ${account_uid}
		)
	)
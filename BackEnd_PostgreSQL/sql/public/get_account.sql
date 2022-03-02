select
	row_number() over() as ROW_NUM_ID,
	A.*
from
	ACCOUNTS A
where
	($1::varchar is null
		or (upper(account) like concat( '%', upper( $1::varchar ), '%' )))
	and(
		$2::varchar is null
		or(
			account_uid = $2::varchar
		)
	)
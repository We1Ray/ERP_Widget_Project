select
	row_number() over() as ROW_NUM_ID,
	A.*
from
	SYSTEM_FACTORY_LIST A
where
	A.SYSTEM_UID = $1::varchar
	and(
		(
			$2::varchar is null
			or $2::varchar = ''
		)
		or A.IS_ENABLED = $2::varchar
	)
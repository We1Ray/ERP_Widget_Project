select
	row_number() over() as ROW_NUM_ID,
	A.*
from
	FUNCTION_LIST A
where
	PROGRAM_UID = coalesce(
		$1::varchar,
		PROGRAM_UID
	)
	and SYSTEM_UID = coalesce(
		$2::varchar,
		SYSTEM_UID
	)
order by
	SEQ
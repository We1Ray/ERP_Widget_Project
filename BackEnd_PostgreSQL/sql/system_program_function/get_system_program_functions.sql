select
	row_number() over() as ROW_NUM_ID,
	A.*
from
	FUNCTION_LIST A
where
	PROGRAM_UID = coalesce(
		${functionadmin_PROGRAM_UID},
		PROGRAM_UID
	)
	and SYSTEM_UID = coalesce(
		${functionadmin_SYSTEM_UID},
		SYSTEM_UID
	)
order by
	SEQ
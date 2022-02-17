select
	PROGRAM_UID,
	SYSTEM_UID,
	PROGRAM_CODE,
	PROGRAM_NAME,
	I18N,
	ICON,
	path,
	PARENT_UID,
	IS_DIR,
	ENABLED,
	NODE_LEVEL,
	SEQ
from
	PROGRAM_LIST
where
	SYSTEM_UID = $1::varchar
	and NODE_LEVEL::varchar = coalesce(
		$2::varchar,
		NODE_LEVEL::varchar
	)
order by
	NODE_LEVEL,
	SEQ
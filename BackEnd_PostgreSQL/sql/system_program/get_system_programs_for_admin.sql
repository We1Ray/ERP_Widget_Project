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
	SYSTEM_UID = ${programadmin_SYSTEM_UID}
	and NODE_LEVEL::varchar = coalesce(
		${programadmin_NODE_LEVEL},
		NODE_LEVEL::varchar
	)
order by
	NODE_LEVEL,
	SEQ
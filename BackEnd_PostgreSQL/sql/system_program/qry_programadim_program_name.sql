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
	PROGRAM_UID = ${program_uid}
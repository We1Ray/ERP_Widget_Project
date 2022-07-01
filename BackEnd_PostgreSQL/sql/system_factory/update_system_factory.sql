update
	SYSTEM_FACTORY_LIST
set
	FACTORY_NAME = ${factory_name},
	WS_URL = ${ws_url},
	WS_DATASOURCE = ${ws_datasource},
	IS_ENABLED = ${is_enabled}
where
	FACTORY_UID = ${factory_uid}
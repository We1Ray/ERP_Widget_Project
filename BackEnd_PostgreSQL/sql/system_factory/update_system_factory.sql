update
	SYSTEM_FACTORY_LIST
set
	FACTORY_NAME = $1::varchar,
	WS_URL = $2::varchar,
	WS_DATASOURCE = $3::varchar,
	IS_ENABLED = $4::varchar
where
	FACTORY_UID = $5::varchar
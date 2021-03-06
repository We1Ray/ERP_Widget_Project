insert
	into
		SYSTEM_FACTORY_LIST(
			FACTORY_UID,
			SYSTEM_UID,
			FACTORY_NAME,
			WS_URL,
			WS_DATASOURCE,
			IS_ENABLED
		)
	values(
		${factory_uid},
		${system_uid},
		${factory_name},
		${ws_url},
		${ws_datasource},
		coalesce(
			${is_enabled},
			'N'
		)
	)
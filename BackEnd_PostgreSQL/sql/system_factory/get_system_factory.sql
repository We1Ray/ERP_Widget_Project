select
	row_number() over() as ROW_NUM_ID,
	A.*
from
	SYSTEM_FACTORY_LIST A
where
	A.SYSTEM_UID = ${system_uid}
	and(
		(
			${system_factory_IS_ENABLED} is null
			or ${system_factory_IS_ENABLED} = ''
		)
		or A.IS_ENABLED = ${system_factory_IS_ENABLED}
	)
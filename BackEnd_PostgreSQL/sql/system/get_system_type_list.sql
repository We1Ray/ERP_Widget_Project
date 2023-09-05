select
	*
from
	(
		select
			'WEB' SYSTEM_TYPE,
			'WEB' SYSTEM_TYPE_NAME,
			1 SEQ
	union all select
			'APP' SYSTEM_TYPE,
			'APP' SYSTEM_TYPE_NAME,
			2 SEQ
	union all select
			'ZK' SYSTEM_TYPE,
			'ZK' SYSTEM_TYPE_NAME,
			3 SEQ
	union all select
			'A' SYSTEM_TYPE,
			'A' SYSTEM_TYPE_NAME,
			4 SEQ
	) A
order by
	SEQ
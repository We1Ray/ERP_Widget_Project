with recursive CTE as(
	select
		GROUP_UID,
		GROUP_NAME,
		IS_CORE,
		ENABLED,
		PARENT_GROUP_UID,
		1 as level
	from
		GROUP_LIST
	where
		GROUP_UID = $1::varchar
union all select
		t.GROUP_UID,
		t.GROUP_NAME,
		t.IS_CORE,
		t.ENABLED,
		t.PARENT_GROUP_UID,
		c.level + 1
	from
		cte c join GROUP_LIST t on
		c.PARENT_GROUP_UID = t.GROUP_UID
) select
	coalesce(
		D.EDITABLE,
		'Y'
	) EDITABLE,
	case
		when(
			(
				coalesce(
					B.IS_OPEN,
					0
				)+ coalesce(
					D.IS_OPEN,
					0
				)
			)> 0
		) then 'Y'
		else 'N'
	end IS_OPEN,
	A.FUNCTION_UID,
	A.FUNCTION_NAME,
	A.FUNCTION_DESC,
	A.FUNCTION_CODE,
	A.IS_CORE,
	$1::varchar GROUP_UID
from
	FUNCTION_LIST A left join(
		select
			A.FUNCTION_UID,
			sum( IS_OPEN::integer ) IS_OPEN,
			'Y' EDITABLE
		from
			GROUP_FUNCTION_SETTING A
		where
			GROUP_UID = $1::varchar
			and FACTORY_UID = $2::varchar
		group by
			A.FUNCTION_UID
	) B on
	A.FUNCTION_UID = B.FUNCTION_UID left join(
		select
			A.FUNCTION_UID,
			sum( IS_OPEN::integer ) IS_OPEN,
			case
				when sum( IS_OPEN::integer )> 0 then 'N'
				else 'Y'
			end EDITABLE
		from
			GROUP_FUNCTION_SETTING A inner join(
				select
					*
				from
					CTE
				where
					group_uid != $1::varchar
				order by
					PARENT_GROUP_UID
			) B on
			A.GROUP_UID = B.GROUP_UID
		where
			A.FACTORY_UID = $2::varchar
		group by
			A.FUNCTION_UID
	) D on
	A.FUNCTION_UID = D.FUNCTION_UID
	and D.IS_OPEN > 0 left join PROGRAM_LIST C on
	C.PROGRAM_UID = A.PROGRAM_UID
where
	A.SYSTEM_UID = coalesce(
		$3::varchar,
		A.SYSTEM_UID
	)
	and A.PROGRAM_UID = coalesce(
		$4::varchar,
		A.PROGRAM_UID
	)
	and $2::varchar is not null
order by
	C.NODE_LEVEL,
	C.SEQ,
	A.SEQ
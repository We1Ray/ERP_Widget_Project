select
	row_number() over() as ROW_NUM_ID,
	case
		when ${group_GROUP_NAME} is null then 'N'
		when A.GROUP_NAME like concat( '%', ${group_GROUP_NAME}, '%' ) then 'Y'
		else 'N'
	end UNFOLD,
	A.GROUP_UID,
	A.GROUP_NAME,
	A.IS_CORE,
	A.ENABLED,
	A.PARENT_GROUP_UID,
	B.GROUP_NAME PARENT_GROUP_NAME
from
	GROUP_LIST A left join GROUP_LIST B on
	B.GROUP_UID = A.PARENT_GROUP_UID
select
	row_number() over() as ROW_NUM_ID,
	GROUP_NAME,
	GROUP_UID
from
	GROUP_LIST
where
	GROUP_UID = ${group_uid}
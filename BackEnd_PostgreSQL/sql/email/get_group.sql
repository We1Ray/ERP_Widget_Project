select
	row_number() over() as ROW_NUM_ID,
	eg.groupid,
	eg.groupname
from
	email_groups eg
where
	(${groupid} is null
		or eg.groupid  like '%' || ${groupid} || '%')
	and 
		(${groupname} is null
		or eg.groupname like '%' || ${groupname} || '%')
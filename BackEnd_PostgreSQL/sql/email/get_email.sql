select
	row_number() over() as ROW_NUM_ID,
	e.*
from
	emails e
where
	(${email} is null
		or e.email like '%' || ${email} || '%')
	and 
		(${displayname} is null
		or e.displayname like '%' || ${displayname} || '%')
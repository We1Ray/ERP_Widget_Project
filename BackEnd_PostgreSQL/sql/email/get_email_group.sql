select
	row_number() over() as ROW_NUM_ID,
	eg.email,
	eg.groupid,
	eg.displayname,
	eg2.groupname
from
	emails_group eg,
	email_groups eg2
where
	eg.email = ${email}
	and eg.displayname = ${displayname}
	and eg.groupid = eg2.groupid
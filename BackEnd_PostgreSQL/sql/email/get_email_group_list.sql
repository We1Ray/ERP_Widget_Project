select
	eg.*
from
	email_groups eg
where
	groupid not in (
	select
		groupid
	from
		emails_group eg2
	where
		eg2.email = ${email}
		and eg2.displayname = ${displayname}
		)
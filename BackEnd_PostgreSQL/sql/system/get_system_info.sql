select
	c.account,
	c.name,
	s.system_uid,
	s.system_name,
	s.system_desc
from
	system_list s,
	account_token a,
	accounts c
where
	a.access_token = ${access_token}
	and expiration_date >= date_trunc('day', current_date)
	and is_effective = 'Y'
	and a.account_uid = c.account_uid
	and s.system_uid = ${system_uid}
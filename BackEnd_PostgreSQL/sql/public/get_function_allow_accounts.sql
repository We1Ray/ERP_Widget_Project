with recursive cte as(
select
	*
from
	group_list
where
	enabled = 'Y'
	and group_uid in(
	select
		c.group_uid
	from
		program_list a
	left join function_list b on
		b.program_uid = a.program_uid
		and b.enabled = 'Y'
	inner join group_function_setting c on
		c.function_uid = b.function_uid
		and c.is_open::integer > 0
		and c.factory_uid = ${factory_uid}
	where
		a.system_uid = ${system_uid}
		and a.program_code = ${program_code}
		and b.function_code = ${function_code}
		)
union all
select
		t.*
from
		cte c
join group_list t on
		t.parent_group_uid = c.group_uid
)
select
	a.account_uid,
	a.account,
	a.name,
	a.email
from
	accounts a
inner join (
	select
		distinct account_uid
	from
		account_groups
	where
		group_uid in (
		select
			group_uid
		from
			cte)) v on
	v.account_uid = a.account_uid
where
	((${is_access_uid} is null
		or ${is_access_uid} = '')
	or a.account_uid in ([0])) and
	((${is_exclude_uid} is null
		or ${is_exclude_uid} = '')
	or a.account_uid not in ([1]))
	and ( upper (a.account) like '%' || upper ( coalesce(${key_word}, '')) || '%'
		or upper (a.name) like '%' || upper ( coalesce(${key_word}, '')) || '%'
      )
	and ((${access_token} is null
		or ${access_token} = '')
	or a.account_uid in (
	select
		account_uid
	from
		account_token
	where
		access_token = ${access_token}
		and expiration_date >= date_trunc('day', current_date)
			and is_effective = 'Y'
))

select
	*
from
	(
	select
		cm.room_id ,
		cm.message_content, 
		cm.send_member, 
		a."name" send_member_name,
		cm.read_member ,
		cm.create_date
	from
		chat_message cm ,
		accounts a
	where
		cm.send_member = a.account_uid
		and
	:room_id = room_id
	order by
		create_date desc
	limit 50) x
order by
	create_date asc
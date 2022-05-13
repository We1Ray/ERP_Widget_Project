select
	*
from
	chat_message cm
where
	room_id = ${room_id}
	and ${message_seq}::numeric + 25 >= message_seq
	and message_seq >= ${message_seq}::numeric -25
order by
	create_date asc;
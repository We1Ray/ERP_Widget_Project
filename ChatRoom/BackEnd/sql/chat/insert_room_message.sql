insert
	into
	chat_message
(room_id,
	message_id,
	message_content,
	send_member,
	read_member,
	create_date)
select
	${room_id},
	${message_id},
	${message_content} ,	
	${send_member},
	null,
	now()

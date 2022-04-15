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
	:room_id,
	(
	select
		coalesce (max(message_id),
		0)+ 1 message_id
	from
		chat_message cm
	where
		room_id = :room_id_1) as message_id,
	:message_content ,	
	:send_member,
	'',
	now()

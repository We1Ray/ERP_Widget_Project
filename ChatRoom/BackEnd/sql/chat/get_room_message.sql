insert
	into
	public.chat_message
(room_id,
	message_id,
	message_content,
	send_member,
	read_member,
	create_date)
select
	$1::varchar,
	(
	select
		coalesce (max(message_id),
		0)+ 1 message_id
	from
		chat_message cm
	where
		room_id = $1::varchar) as message_id,
	$2::varchar,
	$3::varchar,
	'',
	now()
	
	

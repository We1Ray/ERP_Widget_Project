select
		row_number() over() as row_num_id,
	cr.*
from
		chat_room cr
where
		$1::varchar = any(string_to_array(room_member, ';') )
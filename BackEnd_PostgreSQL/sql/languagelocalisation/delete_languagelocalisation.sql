delete
from
	UI_CAPTION_PROPERTIES
where
	LANGUAGE = $1::varchar
	and source = $2::varchar
	and WORD = $3::varchar
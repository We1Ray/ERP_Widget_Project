select
	language,
	source,
	word,
	display
from
	UI_CAPTION_PROPERTIES
where
	language = coalesce ( ${language},
	language)
	and source = coalesce ( ${source},
	source)
	and WORD = coalesce ( ${word},
	WORD)
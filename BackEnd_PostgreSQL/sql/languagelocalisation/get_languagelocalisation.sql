select
	row_number() over() as ROW_NUM_ID,
	A.*
from
	UI_CAPTION_PROPERTIES A
where
	(
		WORD like concat( '%', coalesce( ${languagelocalisation_KEY}, WORD ), '%' )
		or DISPLAY like concat( '%', coalesce( ${languagelocalisation_KEY}, DISPLAY ), '%' )
	)
	and(
		${languagelocalisation_SOURCE} is null
		or(
			"source" = any(
				string_to_array(
					${languagelocalisation_SOURCE},
					','
				)
			)
		)
	)
	and(
		${languagelocalisation_LANGUAGE} is null
		or(
			language = any(
				string_to_array(
					${languagelocalisation_LANGUAGE},
					','
				)
			)
		)
	)
	and(
		${languagelocalisation_UP_DATE1} is null
		or(
			to_timestamp(
				TO_CHAR(
					UP_DATE,
					'yyyy-MM-dd'
				),
				'yyyy-MM-dd'
			)>= to_timestamp(
				${languagelocalisation_UP_DATE1},
				'YYYY/MM/DD'
			)
		)
	)
	and(
		${languagelocalisation_UP_DATE2} is null
		or(
			to_timestamp(
				TO_CHAR(
					UP_DATE,
					'yyyy-MM-dd'
				),
				'yyyy-MM-dd'
			)<= to_timestamp(
				${languagelocalisation_UP_DATE2},
				'YYYY/MM/DD'
			)
		)
	)
	and(
		${languagelocalisation_UP_USER} is null
		or(
			up_user = ${languagelocalisation_UP_USER}
		)
	)
order by
	source,
	WORD,
	language
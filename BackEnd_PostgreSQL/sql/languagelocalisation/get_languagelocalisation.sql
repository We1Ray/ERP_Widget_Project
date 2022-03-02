select
	row_number() over() as ROW_NUM_ID,
	A.*
from
	UI_CAPTION_PROPERTIES A
where
	(
		WORD like concat( '%', coalesce( $1::varchar, WORD ), '%' )
		or DISPLAY like concat( '%', coalesce( $1::varchar, DISPLAY ), '%' )
	)
	and(
		$2::varchar is null
		or(
			"source" = any(
				string_to_array(
					$2::varchar,
					','
				)
			)
		)
	)
	and(
		$3::varchar is null
		or(
			language = any(
				string_to_array(
					$3::varchar,
					','
				)
			)
		)
	)
	and(
		$4::varchar is null
		or(
			to_timestamp(
				TO_CHAR(
					UP_DATE,
					'yyyy-MM-dd'
				),
				'yyyy-MM-dd'
			)>= to_timestamp(
				$4::varchar,
				'YYYY/MM/DD'
			)
		)
	)
	and(
		$5::varchar is null
		or(
			to_timestamp(
				TO_CHAR(
					UP_DATE,
					'yyyy-MM-dd'
				),
				'yyyy-MM-dd'
			)<= to_timestamp(
				$5::varchar,
				'YYYY/MM/DD'
			)
		)
	)
	and(
		$6::varchar is null
		or(
			up_user = $6::varchar
		)
	)
order by
	source,
	WORD,
	LANGUAGE
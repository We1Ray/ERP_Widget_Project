with cte_dual as(
select
		C.ACCOUNT,
		${language} as language,
		${source} as source,
		${word} as WORD
from
		ACCOUNT_TOKEN A,
		ACCOUNTS C
where
		A.ACCESS_TOKEN = ${access_token}
	and EXPIRATION_DATE >= DATE_TRUNC(
			'day',
			now()
		)
	and IS_EFFECTIVE = 'Y'
	and A.ACCOUNT_UID = C.ACCOUNT_UID
),
cte_update as(
update
		UI_CAPTION_PROPERTIES as a
	set
		DISPLAY = ${display},
		UP_DATE = now(),
		UP_USER = b.ACCOUNT
from
		cte_dual as b
where
		b.LANGUAGE = a.LANGUAGE
	and b.SOURCE = a.SOURCE
	and b.WORD = a.WORD returning b.*
)
insert
	into
		UI_CAPTION_PROPERTIES(
			language,
			source,
			WORD,
			DISPLAY,
			UP_USER,
			UP_DATE,
			CREATE_USER,
			CREATE_DATE
		)
select
			d.LANGUAGE,
			d.SOURCE,
			d.WORD,
			${display},
			d.ACCOUNT,
			now(),
			d.ACCOUNT,
			now()
from
			cte_dual as d
where
			not exists(
	select
					*
	from
					cte_update as u,
					cte_dual as d
	where
					u.LANGUAGE = d.LANGUAGE
		and u.SOURCE = d.SOURCE
		and u.WORD = d.WORD
			)
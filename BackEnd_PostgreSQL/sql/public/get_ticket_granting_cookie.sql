select
	B.ACCOUNT LDAP_ID,
	B.email,
	B."name"
from
	ACCOUNT_TOKEN A
inner join ACCOUNTS B on
	A.ACCOUNT_UID = B.ACCOUNT_UID
where
	A.ACCESS_TOKEN = ${access_token}
	and A.EXPIRATION_DATE >= DATE_TRUNC('day',
	now())
	and A.IS_EFFECTIVE = 'Y'
	and A.ismobile = ${isMobile}
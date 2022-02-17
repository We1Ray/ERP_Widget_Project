delete
from
	ACCOUNT_AVAILABLE_SYSTEMS
where
	ACCOUNT_UID = $1::varchar
	and SYSTEM_UID = $2::varchar
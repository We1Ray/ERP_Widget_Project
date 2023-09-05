select
	row_number() over() as ROW_NUM_ID,
	B.ACCOUNT,
	B.name,
	A.*
from
	ACCOUNT_AVAILABLE_SYSTEMS A,
	ACCOUNTS B
where
	A.ACCOUNT_UID = B.ACCOUNT_UID
	and A.SYSTEM_UID =${administrator_SYSTEM_UID}
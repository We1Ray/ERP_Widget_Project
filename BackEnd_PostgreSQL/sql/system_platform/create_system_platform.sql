INSERT INTO SYSTEM_PLATFORM
   (PLATFORM_CODE, PLATFORM_NAME, SEQ, ENABLED)
 VALUES
   (:PLATFORM_CODE, :PLATFORM_NAME, :SEQ, NVL(:ENABLED, 'Y'))
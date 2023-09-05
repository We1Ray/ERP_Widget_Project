delete from group_function_setting where function_uid in (
    select function_uid from function_list where program_uid = ${program_uid}
)
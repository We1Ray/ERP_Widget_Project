select program_uid,
       system_uid,
       program_code,
       program_name,
       i18n,
       icon,
       path,
       parent_uid,
       is_dir,
       enabled,
       node_level,
       seq
  from program_list
 where program_code = ${program_code}
function getModulesArrayID(i, module_array_start, module_size) {
  return (i - module_array_start) / module_size;
}

// DDR
function print_info() {
  const module_array_start = mem.u32[0x80053c10];
  const module_array_end = mem.u32[0x80053c14];
  const module_size = 0x74;
  var module_ID = 0;
  var count = 0;
  var module_addr = 0;

  console.log('----------------------------------------------');
  for (var i = module_array_start; i < module_array_end; i += module_size) {
    module_ID = mem.s16[i];
    if (module_ID > 0) {
      console.log(
        'modules_array[',
        getModulesArrayID(i, module_array_start, module_size),
        '] = ',
        i.toString(16),
        '(',
        module_ID.toString(16),
        ')'
      );
      count++;
    }
  }
  console.log('----------------------------------------------');
  console.log('Number of modules =', count);
}

print_info();

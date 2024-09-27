function getObjectsArrayID(i, object_array_start, object_size) {
  return (i - object_array_start) / object_size;
}

// LoD (USA)
function print_info() {
  const object_array_start = mem.u32[0x800c1530];
  const object_array_end = mem.u32[0x800c1534];
  const object_size = 0x74;
  var object_ID = 0;
  var count = 0;
  var object_addr = 0;

  console.log('----------------------------------------------');
  for (var i = object_array_start; i < object_array_end; i += object_size) {
    object_ID = mem.s16[i];
    if (object_ID > 0) {
      console.log(
        'objects_array[',
        getObjectsArrayID(i, object_array_start, object_size),
        '] = ',
        i.toString(16),
        '(',
        object_ID.toString(16),
        ')'
      );
      count++;
    }
  }
  console.log('----------------------------------------------');
  console.log('Number of objects =', count);
}

print_info();

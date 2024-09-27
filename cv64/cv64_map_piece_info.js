function print_info() {
	const start = 0x8018cab0;
	const size = 0x54;
	const num = 9;
	const vec_offset = 0x04;
	const isActive_offset = 0x18;
	
	var x = 0;
	var y = 0;
	var z = 0;
	var isActive = 0;
	
	for (var i = 0; i < num; i += 1) {
		x = mem.s16[start + (size * i) + vec_offset + 0];
		y = mem.s16[start + (size * i) + vec_offset + 2];
		z = mem.s16[start + (size * i) + vec_offset + 4];
		isActive = mem.s16[start + (size * i) + isActive_offset];
		
		console.log(" ---- ", i, " ----");
		console.log("x: ", x);
		console.log("y: ", y);
		console.log("z: ", z);
		console.log("isActive: ", (isActive == 1) ? "TRUE" : "FALSE");
	}
}

print_info();

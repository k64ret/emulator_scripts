function getfigsArrayID(i, fig_array_start, fig_size) {
	return ((i - fig_array_start) / fig_size);
}

// CV64 (USA v1.0)
function print_info() {
	const fig_array_start = 0x8034EAB8;
	const fig_array_end = 0x80363AB8;
	const fig_size = 0xA8;
	var field_0x00 = 0;
    var field_0x02 = 0;
    var display_list_addr = 0;
	var count = 0;
	
	console.log("----------------------------------------------");
	for (var i = fig_array_start; i < fig_array_end; i += fig_size) {
		field_0x00 = mem.s16[i];
        field_0x02 = mem.s16[i + 2];
        display_list_addr = mem.u32[i + 0x34];
        field_0x00 = field_0x00 >>> 0;      // Signed -> Unsigned
        field_0x02 = field_0x02 >>> 0;      // Signed -> Unsigned
        
		if (field_0x00 != 0) {
			console.log("figs_array[", getfigsArrayID(i, fig_array_start, fig_size), "] = ", i.toString(16), "(", field_0x00.toString(16), " | ", field_0x02.toString(16), ") --- DL = ", display_list_addr.toString(16));
			count++;
		}
	}
    console.log("----------------------------------------------");
    console.log("Number of figs =", count);
}

print_info();

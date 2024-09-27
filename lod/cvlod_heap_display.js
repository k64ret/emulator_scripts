// LoD (USA)
const heap_array_start = 0x801B1D00;
const heap_array_end = 0x801B1D60;
const is_expansion_pak = 0x801C82F4;

const heap_array_entry_size = 0x0C;
const heap_block_header_size = 0x18;

const heapIDStrings = [
	"HEAP_KIND_0",
	"HEAP_KIND_1",
	"HEAP_KIND_2",
	"HEAP_KIND_3",
	"HEAP_KIND_4",
	"HEAP_KIND_5",
	"HEAP_KIND_6",
	"HEAP_KIND_7"
];

function isExpansionPakEnabled() {
	return mem.s16[is_expansion_pak] ? "YES" : "NO";
}

var heapBlockFlags = [
    { name: "HEAP_BLOCK_GRAPHIC_CONTAINER", value: 0x4000 },
    { name: "HEAP_BLOCK_ACTIVE", value: 0x8000 }
];

var heapFlags = [
    { name: "HEAP_WRITE_BACK_CACHE_TO_RAM", value: 0x4000 },
    { name: "HEAP_ACTIVE", value: 0x8000 }
];

function getFlagString(flags, flagDefinitions, freeStateName) {
    var result = [];
    
    for (var i = 0; i < flagDefinitions.length; i++) {
        var flag = flagDefinitions[i];
        if (flags & flag.value) {
            result.push(flag.name);
        }
    }
    
    return result.length > 0 ? result.join(" | ") : freeStateName;
}

function getHeapIDString(heapID) {
	if (heapID >= 8) {
		return "";
	}
	else {
		return heapIDStrings[heapID];
	}
}

function printHeapInfo(flags, size, heap_start) {
	console.log("flags: ", getFlagString(flags, heapFlags, "HEAP_INACTIVE"));
	console.log("size: ", size);
	console.log("heap_start: ", heap_start.toString(16));
}

function printHeapBlock(flags, size, field_0x08, data_start, data_end, raw_data_start) {
	console.log("	flags: ", getFlagString(flags, heapBlockFlags, "HEAP_BLOCK_FREE"));
	console.log("	size: ", size);
	console.log("	graphic_container.field_0x00: ", field_0x08.toString(16));
	console.log("	graphic_container.data_ptrs[0]: ", data_start.toString(16));
	console.log("	graphic_container.data_ptrs[1]: ", data_end.toString(16));
	console.log("	raw_data_start: ", raw_data_start.toString(16));
}

function printHeaps() {
	var heapInfo_flags = 0;
	var heapInfo_maxSize = 0;
	var heapInfo_dataStart = 0;
	var heapInfo_dataEnd = 0;

	var heapBlock_flags = 0;
	var heapBlock_dataStart = 0;
	var heapBlock_maxSize = 0;

	var heapInfo_index = 0;
	var heapBlock_index = 0;

	var heapInfo_usedSpace = 0;

	// Loop through each of heap
	for (var i = heap_array_start; i < heap_array_end; i += heap_array_entry_size) {
		// Get heap header variables
		heapInfo_flags = mem.u16[i];
		heapInfo_maxSize = mem.u32[i + 4];
		heapInfo_dataStart = mem.u32[i + 8];
		heapInfo_dataEnd = heapInfo_dataStart + heapInfo_maxSize;

		// Print heap header
		console.log("--------- heap[", getHeapIDString(heapInfo_index), "] ---------");
		printHeapInfo(heapInfo_flags, heapInfo_maxSize, heapInfo_dataStart);
		console.log("----------------------------------------------");

		// Don't print contents of inactive heap
		if (heapInfo_flags != 0) {
			// Loop through all blocks within heap
			var j = heapInfo_dataStart;
			while (j < heapInfo_dataEnd) {
				heapBlock_flags = mem.u16[j];
				heapBlock_maxSize = mem.u32[j + 4];
				heapBlock_dataStart = mem.u32[j + 0xC];
				// Don't print block marked as free
				if (heapBlock_flags != 0) {
					console.log("	Block", heapBlock_index, "(", j.toString(16), ")");
					console.log("	-------------------");
					printHeapBlock(heapBlock_flags, heapBlock_maxSize, mem.u32[j + 8], heapBlock_dataStart, mem.u32[j + 0x10], (j + 0x18).toString(16));
					console.log("	-------------------");
					heapInfo_usedSpace += heapBlock_maxSize;
				}
				j += heap_block_header_size + heapBlock_maxSize;
				heapBlock_index += 1;
			}
		}
		console.log(heapInfo_usedSpace, "/", heapInfo_maxSize, "bytes used\n");
		heapInfo_index += 1;
		heapBlock_index = 0;
		heapInfo_usedSpace = 0;
	}
    console.log("----------------------------------------------");
}

console.log("Expansion Pak Enabled? : ", isExpansionPakEnabled(),"\n");
printHeaps();

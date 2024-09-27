# Castlevania: Legacy of Darkness (USA)

- `cvlod_heap_display.js`: Shows the state of all heaps, and each of the blocks allocated within each heap.</br></br>
  Note that when allocating new blocks, the game doesn't clean the block header, so sometimes there may be leftover data from previous allocations, showing unusual data, such as wrong pointers.

- `cvlod_object_ID_display.js`: Shows each non-emptyslot from the `Objects_array`, alongside its address and ID number.

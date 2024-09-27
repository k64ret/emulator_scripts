# Castlevania 64 (USA v1.0)

* `cv64_figures_display.js`: Displays the more relevant variables from each entry of the `figures_array` list, which stores instances of models, cameras and lights.

* `cv64_heap_display.js`: Shows the state of all heaps, and each of the blocks allocated within each heap.</br></br>
Note that when allocating new blocks, the game doesn't clean the block header, so sometimes there may be leftover data from previous allocations, showing unusual data, such as wrong pointers.

* `cv64_map_piece_info.js`: Displays information on the currently loaded map pieces, which are subdivisions of the current map loaded into a grid that are used to display large maps without increasing performance.</br></br>
The information shown includes the state of the loaded map piece (active or inactive), as well as its location within the imaginary grid (this grid "moves" while the player is moving through the different map pieces).

* `cv64_object_ID_display.js`: Shows each non-emptyslot from the `Objects_array`, alongside its address and ID number.
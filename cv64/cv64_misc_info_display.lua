-- Examples from: https://skelux.net/showthread.php?tid=526

local OBJ_BASE = 0x00342060 -- base address of objects array
local OBJ_LEN = 0x74 -- length of each object in bytes
local OBJ_ARRAY_COUNT = 0x180 -- max amount of objects allocated in objects array
local PLAYER_OBJ = 0x003427a0
local RDRAM_BASE_ADDR = 0x80000000
local PLAYER_CURRENTLY_TARGETED_ENEMY = 0x002d7a58
local PLAYER_COLL_INFO_WALL_ADDR = 0x800D7BA0

local vspace = 14 -- spacing between each line
local vstart = 100 -- y value to start printing

local player_states = {}
player_states[0x00] = "INIT"
player_states[0x01] = "IDLE"
player_states[0x02] = "DAMAGE"
player_states[0x03] = "JUMP"
player_states[0x04] = "ATTACK"
player_states[0x05] = "ACTION"
player_states[0x06] = "MOVING"
player_states[0x07] = "LEDGE_MOVEMENT"
player_states[0x08] = "FALLING"
player_states[0x09] = "SLIDE"
player_states[0x0A] = "ENEMY_LOCK"
player_states[0x0B] = "DEAD"
player_states[0x0C] = "FROZEN"
player_states[0x0D] = "FROZEN_GRAB"

console.clear()
memory.usememorydomain("RDRAM")

function getSpeedFromVelocityVec3f(velocity)
	return math.sqrt(
		velocity[0] * velocity[0]
			+ velocity[1] * velocity[1]
			+ velocity[2] * velocity[2]
	)
end

-- read vec3f from memory
function readVec3f(addr)
	vec3f = {}
	for i = 0, 2 do
		vec3f[i] = memory.readfloat(addr + 4 * i, true)
	end
	return vec3f
end

-- read vec3s
function readVec3s(addr)
	vec3s = {}
	for i = 0, 2 do
		vec3s[i] = memory.read_s16_be(addr + 2 * i)
	end
	return vec3s
end

-- print vec3f
function printVec3f(x, y, name, vec3f)
	gui.text(
		x,
		y,
		string.format(
			"%s %5.1f, %5.1f, %5.1f",
			name,
			vec3f[0],
			vec3f[1],
			vec3f[2]
		)
	)
end

-- print vec3s
function printVec3s(x, y, name, vec3s)
	gui.text(
		x,
		y,
		string.format("%s %04d, %04d, %04d", name, vec3s[0], vec3s[1], vec3s[2])
	)
end

-- parse common actor variables from its base address
function ReadActorVars(actor_addr)
	local actor = {}

	actor.model = memory.read_u32_be(actor_addr + 0x24) - RDRAM_BASE_ADDR
	actor.position = readVec3f(actor.model + 0x40)
	actor.angle = readVec3s(actor.model + 0x4C)
	actor.size = readVec3f(actor.model + 0x58)
	return actor
end

function ReadPlayerVars(player_addr)
	local player = {}
	player.actor_vars = ReadActorVars(player_addr)
	player.state = memory.readbyte(player_addr + 0x9)
	player.sub_state = memory.readbyte(player_addr + 0xB)
	player.playerData = memory.read_u32_be(player_addr + 0x28) - RDRAM_BASE_ADDR
	player.velocity = readVec3f(player.playerData + 0x74)
	player.enemy_target = memory.read_u32_be(PLAYER_CURRENTLY_TARGETED_ENEMY)

	-- From playerCollisionInfoWall
	player.collInfoWall = PLAYER_COLL_INFO_WALL_ADDR - RDRAM_BASE_ADDR
	player.wall_push_velocity = readVec3f(player.collInfoWall + 0x10)

	if player.enemy_target ~= 0 then
		player.enemy_target = player.enemy_target - RDRAM_BASE_ADDR
		player.enemy_target_ID = memory.read_u16_be(player.enemy_target)
	else
		player.enemy_target = 0
		player.enemy_target_ID = 0
	end

	return player
end

function readSaveStruct()
	local save = {}
	local saveStruct = 0x00389be4

	save.week = memory.read_s16_be(saveStruct + 0x44)
	save.day = memory.read_s16_be(saveStruct + 0x46)
	save.hour = memory.read_s16_be(saveStruct + 0x48)
	save.minutes = memory.read_s16_be(saveStruct + 0x4A)
	save.seconds = memory.read_s16_be(saveStruct + 0x4C)
	save.milliseconds = memory.read_u16_be(saveStruct + 0x4E)

	return save
end

function inGameplayLoop()
	local gameplayMgr = 0x00342148

	if
		memory.read_u16_be(gameplayMgr) == 0005
		and memory.readbyte(gameplayMgr + 0x9) == 03
		and memory.readbyte(gameplayMgr + 0xB) == 03
	then
		return true
	else
		return false
	end
end

function getObjectCount()
	local obj_count = 0
	local current_obj_addr = OBJ_BASE

	for i = 1, OBJ_ARRAY_COUNT, 1 do
		if memory.read_u16_be(current_obj_addr) ~= 0 then
			obj_count = obj_count + 1
		end
		current_obj_addr = current_obj_addr + OBJ_LEN
	end

	return obj_count
end

while true do
	if inGameplayLoop() == true then
		player = ReadPlayerVars(PLAYER_OBJ)
		save = readSaveStruct()

		gui.text(0, vstart + vspace * 0, string.format("==== Player ===="))
		printVec3f(0, vstart + vspace * 1, "Pos: ", player.actor_vars.position)
		printVec3s(0, vstart + vspace * 2, "Angle: ", player.actor_vars.angle)
		gui.text(
			0,
			vstart + vspace * 3,
			string.format(
				"Speed: %f",
				getSpeedFromVelocityVec3f(player.velocity)
			)
		)
		gui.text(
			0,
			vstart + vspace * 4,
			string.format("State: %s", player_states[player.state])
		)
		gui.text(
			0,
			vstart + vspace * 5,
			string.format("Sub-state: %d", player.sub_state)
		)

		gui.text(
			0,
			vstart + vspace * 7,
			string.format(
				"Enemy Target: %08X (%04X)",
				RDRAM_BASE_ADDR + player.enemy_target,
				player.enemy_target_ID
			)
		)

		gui.text(
			0,
			vstart + vspace * 9,
			string.format("Week: %d, Day: %d", save.week, save.day)
		)
		gui.text(0, vstart + vspace * 10, string.format("Hour: %d", save.hour))
		gui.text(
			0,
			vstart + vspace * 11,
			string.format("Minutes: %d", save.minutes)
		)
		gui.text(
			0,
			vstart + vspace * 12,
			string.format("Seconds: %d", save.seconds)
		)
		gui.text(
			0,
			vstart + vspace * 13,
			string.format("Milliseconds: %d", save.milliseconds)
		)

		gui.text(
			0,
			vstart + vspace * 15,
			string.format("Object count: %d", getObjectCount())
		)
		gui.text(
			0,
			vstart + vspace * 16,
			string.format(
				"Player push speed on wall contact: %f",
				getSpeedFromVelocityVec3f(player.wall_push_velocity)
			)
		)
	end
	emu.frameadvance()
end

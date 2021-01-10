const roleUpgrader = require('role.upgrader')

const selectBuildTarget = creep => {
	const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
	if (!targets.length) return 
	const nearFinished = targets.reduce((prevBest, target) => {
		const prevBestRemaining = prevBest.progressTotal - prevBest.progress
    const targetRemaining = target.progressTotal - target.progress
		return targetRemaining < prevBestRemaining
		? target
		: prevBest
	}, targets[0])
	// const closest = creep.pos.findClosestByPath(targets)
	return nearFinished
}

var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // For lost creeps that accidenally leave the room. Will have to change when expanding
        if (creep.room.controller.id !== '59f1a32d82100e1594f3b13a') return creep.moveTo(Game.getObjectById('59f1a32d82100e1594f3b13a'))
	    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if (creep.memory.building) {
					const target = selectBuildTarget(creep)
            if (target) {
								console.log(creep.memory.role, 'building:', target)
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
							Game.spawns['Spawn1'].memory.fallbacks++
							roleUpgrader.run(creep)
						}
	    }
	    else {
				const storage = Game.getObjectById('5ff9d0880445754ac8aab259')
				let source = storage
				const tombstones = creep.room.find(FIND_TOMBSTONES).filter(tombstone => tombstone.store.getUsedCapacity(RESOURCE_ENERGY))
				if (tombstones.length) {
						source = creep.pos.findClosestByPath(tombstones)
				} else if (!storage.store.getUsedCapacity(RESOURCE_ENERGY)) {
						const structures = creep.room.find(FIND_STRUCTURES)
						const containers = structures.filter(structure => {
										return structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY)
								})
						source = creep.pos.findClosestByPath(containers, { ignoreCreeps: true })
				}
				console.log('builder source:', source)
				if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(source, {visualizePathStyle: {stroke: '#0000ff'}});
				} else if (!source && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) creep.memory.building = true
	    }
	}
};

module.exports = roleBuilder;
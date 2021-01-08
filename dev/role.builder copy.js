const  roleBuilder = require('role.builder')
var roleHarvester = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
					creep.memory.delivering = false;
					creep.say('🔄 harvest');
		}
		if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
				creep.memory.delivering = true;
				creep.say('🚚 deliver');
		}

		if(creep.memory.delivering) {
					const structures = creep.room.find(FIND_MY_STRUCTURES);
				var targets = structures.filter(structure => {
							return (structure.structureType === STRUCTURE_EXTENSION
									|| structure.structureType === STRUCTURE_STORAGE
									|| structure.structureType === STRUCTURE_CONTAINER
									|| structure.structureType === STRUCTURE_SPAWN
									) && structure.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
					})
					if(targets.length) {
							const target = creep.pos.findClosestByPath(targets)
							if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
									creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
							}
					} else {
						roleBuilder.run(creep)
					}
		}
		else {
				var sources = creep.pos.findClosestByPath(FIND_SOURCES);
					if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
							creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
					}
		}
}
};

module.exports = roleHarvester;
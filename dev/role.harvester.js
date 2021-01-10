const roleBuilder = require("role.builder");
const roleUpgrader = require('role.upgrader')

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if (creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
            creep.say('🔄 harvest');
	    }
	    if (!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
	        creep.memory.delivering = true;
	        creep.say('🚚 deliver');
	    }

	    if (creep.memory.delivering) {
            const structures = creep.room.find(FIND_MY_STRUCTURES);
	        const targets = structures.filter(structure => {
                return (structure.structureType === STRUCTURE_EXTENSION
                    || structure.structureType === STRUCTURE_STORAGE
                    || structure.structureType === STRUCTURE_CONTAINER
                    || structure.structureType === STRUCTURE_SPAWN
                    || (structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 200)
                    ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
            })
            if (targets.some(target => target.structureType === STRUCTURE_EXTENSION || target.structureType === STRUCTURE_SPAWN)) targets.filter(target => target.structureType !== STRUCTURE_STORAGE)
            if (targets.length) {
                const target = creep.pos.findClosestByPath(targets)
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleBuilder.run(creep)
            }
	    }
	    else {
	        const droppedSources = creep.room.find(FIND_DROPPED_RESOURCES)
            var source = creep.pos.findClosestByPath(droppedSources.length
                ? droppedSources
                : [
                    ...creep.room.find(FIND_SOURCES).filter(source => source.energy),
                    // ...creep.room.find(FIND_TOMBSTONES),
                    // ...creep.room.find(FIND_STRUCTURES).filter(structure => structure.structureType === STRUCTURE_CONTAINER && structue.store.getUsedCapacity(RESOURCE_ENERGY))
                ])
            if (droppedSources.length && creep.pickup(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#000000' }})
            } else if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
            } else if (!source && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) {
                creep.memory.delivering = true
            } else if (!source && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                creep.memory.formerRole = creep.memory.role
                creep.memory.role = 'upgrader'
            }
	    }
	}
};

module.exports = roleHarvester;
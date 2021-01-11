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
        const energySources = creep.room.find(FIND_SOURCES).filter(source => source.energy && creep.pos.findPathTo(source))
	    if (creep.memory.delivering) {
            const structures = creep.room.find(FIND_STRUCTURES);
	        const allTargets = structures.filter(structure => {
                return (structure.structureType === STRUCTURE_EXTENSION
                    || structure.structureType === STRUCTURE_STORAGE
                    || (structure.structureType === STRUCTURE_CONTAINER && creep.pos.findClosestByPath(energySources))
                    || structure.structureType === STRUCTURE_SPAWN
                    || (structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 200)
                    ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
            })
            const targets = allTargets.some(target => target.structureType === STRUCTURE_EXTENSION || target.structureType === STRUCTURE_SPAWN)
                ? allTargets.filter(target => {
                    return target.structureType !== STRUCTURE_STORAGE
                    && target.structureType !== STRUCTURE_TOWER
                    && target.structureType !== STRUCTURE_CONTAINER
                })
                : allTargets
            if (targets.length) {
                const target = creep.pos.findClosestByPath(targets)
                console.log(creep.name, 'stocking:', target)
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                Game.spawns['Spawn1'].memory.fallbacks++
                roleBuilder.run(creep)
            }
	    } else {
            const droppedSources = creep.room.find(FIND_DROPPED_RESOURCES)
            const containers = energySources.length
                ? []
                : creep.room.find(FIND_STRUCTURES).filter(structure => structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY))
            var source = creep.pos.findClosestByPath(droppedSources.length
                ? droppedSources
                : [
                    ...energySources,
                    ...containers
                ])
            if (droppedSources.length && creep.pickup(source) == ERR_NOT_IN_RANGE) {
                console.log('Harvester source:', source)
                creep.moveTo(source, { visualizePathStyle: { stroke: '#00ff00' }})
            } else if (source && energySources.length && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                console.log('Harvester source:', source)
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
            } else if (source && !energySources.length && creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                console.log('Harvester source:', source)
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
            } else if (!source && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) {
                creep.memory.delivering = true
            } else if (!source && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                // Game.spawns['Spawn1'].memory.fallbacks++
                // creep.memory.formerRole = creep.memory.role
                // creep.memory.role = 'upgrader'
            }
	    }
	}
};

module.exports = roleHarvester;
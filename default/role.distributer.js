const roleBuilder = require("role.builder");

var roleDistributer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if (creep.memory.distributing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.distributing = false;
            creep.say('🔄 withdraw');
	    }
	    if (!creep.memory.distributing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.distributing = true;
	        creep.say('🚚 deliver');
	    }

        const storage = Game.getObjectById('5ff9d0880445754ac8aab259')
	    if (creep.memory.distributing) {
            const structures = creep.room.find(FIND_STRUCTURES);
	        var targets = structures.filter(structure => {
                return (structure.structureType === STRUCTURE_EXTENSION
                    || (structure.structureType === STRUCTURE_SPAWN)
                    || (structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 200)
                    ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
            })
            if (targets.length) {
                const target = creep.pos.findClosestByPath(targets)
                console.log('Distributer supplying:', target.structureType)
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                Game.spawns['Spawn1'].memory.fallbacks++
                roleBuilder.run(creep)
            }
	    }
	    else {
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
            console.log('distributer source:', source)
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#0000ff'}});
            } else if (!source && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) creep.memory.distributing = true
	    }
	}
};

module.exports = roleDistributer;
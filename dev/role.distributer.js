const roleUpgrader = require("role.upgrader");

var roleDistributer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if (creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
            creep.say('🔄 withdraw');
	    }
	    if (!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
	        creep.memory.delivering = true;
	        creep.say('🚚 deliver');
	    }

	    if (creep.memory.delivering) {
            const structures = creep.room.find(FIND_MY_STRUCTURES);
	        var targets = structures.filter(structure => {
                return (structure.structureType === STRUCTURE_EXTENSION
                    || (structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 200)
                    ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
            })
            if (targets.length) {
                const target = creep.pos.findClosestByPath(targets)
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleUpgrader.run(creep)
            }
	    }
	    else {
            var source = creep.room.find(FIND_TOMBSTONES)[0] || Game.getObjectById('5ff9d0880445754ac8aab259')
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#0000ff'}});
            } else if (!source && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) creep.memory.delivering = true
	    }
	}
};

module.exports = roleDistributer;
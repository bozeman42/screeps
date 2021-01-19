var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 Withdrawing');
            if (creep.memory.formerRole) {
                creep.say('Reverting task')
                creep.memory.role = creep.memory.formerRole
                delete creep.memory.formerRole
            }
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }
        if (creep.room.controller.id !== '59f1a32d82100e1594f3b13a') return creep.moveTo(Game.getObjectById('59f1a32d82100e1594f3b13a'))
	    if(creep.memory.upgrading) {
            console.log(`${creep.name} upgrading`)
	        if (creep.room.controller.sign.username !== 'Bozeman' && creep.signController(creep.room.controller, 'Hello, everyone! I am new.') === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.controller)
	        } else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var source = Game.getObjectById('5ff9d0880445754ac8aab259')
            if (!source.store.getUsedCapacity(RESOURCE_ENERGY)) {
                const structures = creep.room.find(FIND_STRUCTURES)
                const containers = structures.filter(structure => {
                        return structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY)
                    })
                source = creep.pos.findClosestByPath(containers, { ignoreCreeps: true })
            }
            
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if (source && !source.store.getUsedCapacity(RESOURCE_ENERGY) && creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
                creep.memory.upgrading = true
            } else if (source && !source.store.getUsedCapacity(RESOURCE_ENERGY) && !creep.store.getUsedCapacity(RESOURCE_ENERGY) && creep.memory.formerRole) {
                creep.say('Reverting task')
                creep.memory.role = creep.memory.formerRole
                delete creep.memory.formerRole
            }
        }
	}
};

module.exports = roleUpgrader;
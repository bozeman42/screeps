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

	    if(creep.memory.upgrading) {
	        if (creep.room.controller.sign.username !== 'Bozeman' && creep.signController(creep.room.controller, 'Hello, everyone! I am new.') === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.controller)
	        } else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var source = Game.getObjectById('5ff9d0880445754ac8aab259')
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if (!source.store.getUsedCapacity(RESOURCE_ENERGY) && creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
                creep.memory.upgrading = true
            } else if (!source.store.getUsedCapacity(RESOURCE_ENERGY) && !creep.store.getUsedCapacity(RESOURCE_ENERGY) && creep.memory.formerRole) {
                creep.say('Reverting task')
                creep.memory.role = creep.memory.formerRole
                delete creep.memory.formerRole
            }
        }
	}
};

module.exports = roleUpgrader;
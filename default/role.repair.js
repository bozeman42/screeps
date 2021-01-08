var roleRepair = {
    run: function(creep, target) {

	    if(creep.memory.repair && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repair = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.repair && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repair = true;
	        creep.say('🛠️ Repair');
	    }

	    if(creep.memory.repair) {
        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleRepair;
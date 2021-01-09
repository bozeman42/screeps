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
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
							roleUpgrader.run(creep)
						}
	    }
	    else {
            var source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES).filter(source => source.energy))
            if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if (!source && creep.store.getUsedCapacity(RESOURCE_ENERGY)) creep.memory.building = true
	    }
	}
};

module.exports = roleBuilder;
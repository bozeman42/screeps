const creepComposition = {
    harvester: 8,
    upgrader: 3,
    builder: 2
}

const creepBody = [
    WORK, CARRY, MOVE, WORK, CARRY
]

const getCost = () => creepBody.reduce((total, part) => total + BODYPART_COST[part], 0)

const cleanupCreeps = () => {
    const names = Object.keys(Memory.creeps)
    names.forEach(name => {
        if (Game.creeps[name] === undefined) delete Memory.creeps[name]
    })
}

const getCreeps = (role, creeps) => {
    return Object.keys(creeps).map(name => creeps[name]).filter(creep => creep.memory.role === role)
}

const spawnCreep = role => Game.spawns['Spawn1'].spawnCreep(creepBody, `${role} ${Date.now()}`, {
        memory: {
            role
    }
})

const maintainSpawn = () => {
    cleanupCreeps()
    const availableEnergy = Game.spawns['Spawn1'].room.energyAvailable
    console.log(getCost(), availableEnergy)
    if (getCost() > availableEnergy) return

    const allCreeps = Game.creeps

    Object.entries(creepComposition).some(([role, quantity]) => {
        const creeps = getCreeps(role, allCreeps)
        if (creeps.length < quantity) {
            console.log(`Spawning ${role}`)
            spawnCreep(role)
            return true
        }
    })
}

module.exports = maintainSpawn
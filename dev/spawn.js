const creepComposition = {
    harvester: 6,
    distributer: 1,
    upgrader: 1,
    builder: 1
}

const creepBody = [
    WORK, CARRY, MOVE, WORK, CARRY, WORK, WORK, MOVE, CARRY, MOVE, CARRY, MOVE
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
    Object.entries(Object.keys(Game.creeps).reduce((obj, name) => {
        const role = Game.creeps[name].memory.role
        if (obj.hasOwnProperty(role)) {
            obj[role]++
        } else {
            obj = {
                ...obj,
                [role]: 1
            }
        }
        return obj
    }, {})).forEach(([role, quantity]) => console.log(`${role}: ${quantity}`))
    const availableEnergy = Game.spawns['Spawn1'].room.energyAvailable
    console.log(getCost(), availableEnergy)
    if (getCost() > availableEnergy) return

    const allCreeps = Game.creeps

    Object.entries(creepComposition).some(([role, quantity]) => {
        const creeps = getCreeps(role, allCreeps)
        console.log(role, creeps.length)
        if (creeps.length < quantity) {
            console.log(`Spawning ${role}`)
            spawnCreep(role)
            return true
        }
    })
}

module.exports = maintainSpawn
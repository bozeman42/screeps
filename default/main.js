const roleDistributer = require('role.distributer')
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepair = require('role.repair')
const spawn = require('spawn')

const REPAIRABLE_STRUCTURE_CONFIG = {
    [STRUCTURE_ROAD]: ROAD_HITS,
    [STRUCTURE_WALL]: 1000000,
    [STRUCTURE_RAMPART]: 500000,
    [STRUCTURE_TOWER]: TOWER_HITS,
    [STRUCTURE_CONTAINER]: CONTAINER_HITS,
}

const MINIMUM_DAMAGE_THRESHOLD = 200

module.exports.loop = function () {
    console.log('\n\n\n\n\n********************************* NEW TICK **********************************')
    initializeTick()
    spawn()
    operateTower()

    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.dying) {
            creep.say('I am dying!')
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) creep.suicide()
            const storage = Game.getObjectById('5ff9d0880445754ac8aab259')
            if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(storage)
        } else if (creep.memory.role === 'distributer') {
            roleDistributer.run(creep)
        } else if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
    announceRoles()
    console.log('################################### END OF TICK ######################################')
}

function announceRoles() {
    console.log('########################## END OF TICK ANNOUNCEMENTS ###########################################')
    console.log(`Role fallbacks initiated: ${Game.spawns['Spawn1'].memory.fallbacks}`)
    const { creeps } = Game
    const roleInfo = Object.keys(creeps).reduce((arr, name) => {
        return creeps[name].memory.formerRole
        ? [
            ...arr,
            `${creeps[name].memory.formerRole} acting as ${creeps[name].memory.role}`
        ] : arr
    }, [])
    if (roleInfo.length) console.log('Acting roles:')
    roleInfo.forEach(announcement => console.log(announcement))
    const nextToDie = Object.entries(Game.creeps).filter(([name, creep]) => creep.ticksToLive).reduce((doomedCreep, [name, creep]) => {
        console.log('Creep:', creep.ticksToLive)
        return doomedCreep.ticksToLive < creep.ticksToLive
            ? doomedCreep
            : creep
    }, { ticksToLive: 1000000000 })
    console.log(`The next creep to die is ${nextToDie.name} in ${nextToDie.ticksToLive}`)
    if (nextToDie.ticksToLive < 30) nextToDie.memory.dying = true
}

function initializeTick() {
    Game.spawns['Spawn1'].memory.fallbacks = 0
}

function operateTower() {
    const tower = Game.getObjectById('5ff88d6b4fe2904b1ea3def0');
    if(tower) {
        const structures = tower.room.find(FIND_STRUCTURES)
            .filter(structure => {
                return structure.hits < (REPAIRABLE_STRUCTURE_CONFIG.hasOwnProperty(structure.structureType) ? REPAIRABLE_STRUCTURE_CONFIG[structure.structureType] : structure.hitsMax) - MINIMUM_DAMAGE_THRESHOLD
            })
        const mostDamagedStructure = structures.reduce((prevWorst, structure) => {
                const prevWorstDamage = REPAIRABLE_STRUCTURE_CONFIG.hasOwnProperty(prevWorst.structureType)
                    ? REPAIRABLE_STRUCTURE_CONFIG[prevWorst.structureType] - prevWorst.hits
                    : prevWorst.hitsMax - prevWorst.hits
                const damage = REPAIRABLE_STRUCTURE_CONFIG.hasOwnProperty(structure.structureType)
                    ? REPAIRABLE_STRUCTURE_CONFIG[structure.structureType] - structure.hits
                    : structure.hitsMax - structure.hits
                console.log(damage, prevWorstDamage)
                return damage > prevWorstDamage ? structure : prevWorst
            }, structures[0])
        if(mostDamagedStructure) {
            tower.repair(mostDamagedStructure);
        }
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
}

function repairsWIP() {
    const structures = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES)
    const worstStructures = structures
        .filter(structure=> {
            return Object.keys(REPAIRABLE_STRUCTURE_CONFIG).some(type => structure.structureType === type)
                && (structure.hits < (REPAIRABLE_STRUCTURE_CONFIG[structure.structureType] - MINIMUM_DAMAGE_THRESHOLD))
        })
    const worstStructure = worstStructures[0] && worstStructures
        .reduce((worstStruct, struct) => {
            const structDamage = REPAIRABLE_STRUCTURE_CONFIG[struct.structureType] - struct.hits
            const worstStructDamage = REPAIRABLE_STRUCTURE_CONFIG[worstStruct.structureType] - worstStruct.hits
            return structDamage > worstStructDamage ? struct : worstStruct
        })

    const nearestRepairCreep = worstStructure && worstStructure.pos.findClosestByPath(Object.keys(Game.creeps).map(x => Game.creeps[x]))
}
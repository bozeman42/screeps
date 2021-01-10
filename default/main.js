const roleDistributer = require('role.distributer')
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepair = require('role.repair')
const spawn = require('spawn')

const REPAIRABLE_STRUCTURE_CONFIG = {
    [STRUCTURE_ROAD]: ROAD_HITS,
    [STRUCTURE_WALL]: 500000,
    [STRUCTURE_RAMPART]: 150000,
    [STRUCTURE_TOWER]: TOWER_HITS,
    [STRUCTURE_CONTAINER]: CONTAINER_HITS,
}

const MINIMUM_DAMAGE_THRESHOLD = 0

module.exports.loop = function () {
    spawn()
    const tower = Game.getObjectById('5ff88d6b4fe2904b1ea3def0');
    if(tower) {
        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < (REPAIRABLE_STRUCTURE_CONFIG.hasOwnProperty(structure.structureType) ? REPAIRABLE_STRUCTURE_CONFIG[structure.structureType] : structure.hitsMax) - 200
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

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

    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (false && nearestRepairCreep && name === nearestRepairCreep.name) {
            roleRepair.run(creep, worstStructure)
        } else {
            if (creep.memory.role === 'distributer') {
                roleDistributer.run(creep)
            } else if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            } else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            } else if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        }
    }
}
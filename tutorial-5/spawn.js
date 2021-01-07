const creepComposition = {
    harvester: 5,
    upgrader: 3
}

const creepBody = [
    WORK, WORK, CARRY, MOVE
]
const getCost = () => creepBody.reduce((total, part) => total + BODYPART_COST[part])


module.exports = {

};
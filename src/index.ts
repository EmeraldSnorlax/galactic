import { randomUUID } from 'crypto';

console.log(`On tick ${Game.time}`);

const buildingPriorities = {
  spawn: 1,
  controller: 0,
};

const numberOfCreeps = Object.keys(Game.creeps).length;
const desiredCreeps = 4;

if (numberOfCreeps < desiredCreeps) {
  const creepName = randomUUID();
  Game.spawns['Abandoned Ship'].spawnCreep([WORK, CARRY, MOVE], creepName, { memory: { isIdle: true } });
}

// Job dispatcher
Object.entries(Game.rooms).forEach(([roomName, room]) => {
  room.find(FIND_MY_STRUCTURES).forEach((structure) => {
    switch (structure.structureType) {
      // eslint-disable-next-line no-lone-blocks
      case STRUCTURE_CONTROLLER: {
        if (structure.level < 2) {
          Memory.objectives.push({
            priority: buildingPriorities[STRUCTURE_CONTROLLER],
            type: 'work',
            target: structure,
            workers: [
              Object.values(Game.creeps)
                .filter((el) => Memory.creeps[el.name].isIdle)[0].name,
            ],
            location: structure.pos,
          });
        } else {
          // amongus
        }
      }
        break;
      default: console.log(`Unhandled structure type: ${structure.structureType}`);
    }
  });
});

// Job executor
Memory.objectives.forEach((objective) => {
  objective.workers.forEach((worker) => {
    const creep = Game.creeps[worker];
    switch (objective.type) {
      case 'work': {
        creep.harvest(objective.target);
      }
        break;
      default: console.log(`Unhandled objective type: ${objective.type}`);
    }
  });
});

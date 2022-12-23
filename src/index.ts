import {
  Job, Role, Target,
} from '../types/screeps';

Memory.jobs = Memory.jobs || [];

function newJob(target: Target, role: Role, priority: number, desiredCreeps: number): Job {
  return {
    id: `${target.room}; T${Game.time} #${(Math.random() * 1000).toFixed(0)}`,
    target,
    role,
    priority,
    assignedCreeps: [],
    desiredCreeps,
  };
}

// Job creator
// eslint-disable-next-line no-unused-vars
Object.entries(Game.spawns).forEach(([name, spawn]) => {
  if (!(Memory.jobs.find((job) => job.target.id === spawn.id))) {
    const job = newJob({
      id: spawn.id, lastSeen: Game.time, pos: spawn.pos, room: spawn.room.name, type: 'spawner',
    }, 'harvester', 1, 2);
    Memory.jobs.push(job);
  } else {
    Memory.jobs.find((j) => j.target.id === spawn.id)!.target.lastSeen = Game.time;
  }
});

// Screep executor
Object.values(Game.creeps).forEach((creep) => {
  switch (creep.memory.role) {
    case 'harvester':
      if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        const nearestSource = creep.pos.findClosestByRange(sources);
        if (nearestSource) {
          if (creep.harvest(nearestSource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(nearestSource, { visualizePathStyle: { stroke: '#ffaa00' } });
          }
        }
      } else {
        const jobTarget = Memory.jobs.find((j) => j.id === creep.memory.jobId)!.target;
        const target = Game.getObjectById(jobTarget.id as Id<Structure>);
        if (creep.transfer(target!, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target!, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
      break;
    default: console.log('Unknown role', creep.memory.role);
  }
});


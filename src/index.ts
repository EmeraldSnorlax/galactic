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

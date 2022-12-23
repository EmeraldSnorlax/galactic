import {
  Job, Role, Target,
} from '../types/screeps';

Memory.jobs = Memory.jobs || [];

function newJob(target: Target, role: Role, priority: number, desiredCreeps: number): Job {
  return {
    id: `${target.room}; T${Game.time} #${(Math.random() * 100_000).toFixed(0)}`,
    target,
    role,
    priority,
    assignedCreeps: [],
    desiredCreeps,
  };
}

// Job creator
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

function roleToBody(role: Role, parts: number): BodyPartConstant[] {
  const partCounts = {
    WORK: 0,
    CARRY: 0,
    MOVE: 0,
  }

  switch (role) {
    case 'harvester': {
      partCounts.WORK = Math.floor(parts / 3);
      partCounts.CARRY = Math.floor(parts / 3);
      partCounts.MOVE = parts - partCounts.WORK - partCounts.CARRY;
    }
  }

  const body: BodyPartConstant[] = [];
  Object.entries(partCounts).forEach(([part, count]) => {
    for (let i = 0; i < count; i++) {
      body.push(part as BodyPartConstant);
    }
  })
  return body;
}


// Check memory jor jobs that need executing
Memory.jobs.forEach((job) => {
  if (job.assignedCreeps.length < job.desiredCreeps) {
    console.log(`Spawning a ${job.role} for job ${job.id}`)
    // Spawn creeps and assign them to the job
    const creepName = `${job.role} working on ${job.id} S${(Math.random() * 100_000).toFixed(0)}`;
    // Find a spawn in the same room as the job and spawn the creep
    const spawn = Object.values(Game.spawns).find((s) => s.room.name === job.target.room && !s.spawning);
    if (spawn) {
      const body = roleToBody(job.role, 3);
      console.log(`Spawning {${creepName}} with body ${body.join(' ')} in ${spawn.name}`)
      const result = spawn.spawnCreep(body, creepName, { memory: { role: job.role, jobId: job.id } });
      if (result === OK) {
        job.assignedCreeps.push(creepName);
        console.log(`Scheduled ${creepName} for spawning in ${spawn.name}`)
      }
      return;
    }
  }
});
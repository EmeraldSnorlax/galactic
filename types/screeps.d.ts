type StructureName = 'creep' | 'spawner' | 'constructionSite' | 'source' | 'mineral' | 'deposit' | 'flag' | 'controller';

export interface Target {
  pos: { x: number; y: number;}
  room: string;
  lastSeen: number;
  type: StructureName;
  id: string;
}

type Role = 'harvester' | 'defender' | 'scout';

export interface Job {
  id: string;
  target: Target;
  role: Role;
  /** Lower numbers are higher priority. */
  priority: number;
  /** IDs of screeps that have been assigned to this job */
  assignedCreeps: string[];
  /** Number of creeps that should be assigned to this job */
  desiredCreeps: number;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Memory {
    jobs: Job[];
  }
}

// eslint-disable-next-line no-unused-vars
interface CreepMemory {
  /** The ID of the job this creep is assigned to */
  jobId: string;
  role: Role;
}

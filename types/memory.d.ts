/* eslint-disable no-unused-vars */
interface Objective {
  workers: string[];
  type: 'work' | 'attack' | 'heal' | 'claim' | 'defend' | 'explore' | 'move';
  target: Structure | Creep | Flag | Source | Mineral | Resource | Nuke | ConstructionSite | Room;
  priority: number;
  location: RoomPosition;
}

interface Memory {
  objectives: Objective[];
}

interface CreepMemory {
  isIdle: boolean;
}

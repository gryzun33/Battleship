export type MessageType =
  | 'reg'
  | 'update_winners'
  | 'create_room'
  | 'update_room'
  | 'add_user_to_room'
  | 'create_game'
  | 'add_ships'
  | 'start_game'
  | 'turn'
  | 'attack'
  | 'finish'
  | 'randomAttack';

export type PlayerReg = {
  name: string;
  password: string;
};

export type RoomRequest = {
  indexRoom: string;
};

export type PlayerAnswer = {
  name: string;
  index: string;
  error: boolean;
  errorText: string;
};

export type ParsedMessage = {
  type: MessageType;
  data: string;
  id: 0;
};

export type Winner = {
  name: string;
  wins: number;
};

export type Room = {
  roomId: string;
  roomUsers: RoomUser[];
};

export type RoomUser = {
  name: string;
  index: string;
};

export type GameResponse = {
  idGame: string;
  idPlayer: string;
};

export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export type PlayerData = {
  ships: Ship[];
  indexPlayer: string;
};

export type GameSession = {
  players: Map<string, PlayerData>;
  currentPlayer: string;
};

export type ShipsInitialData = {
  gameId: string;
  ships: Ship[];
  indexPlayer: string;
};

export type AttackRequest = {
  gameId: string;
  x: number;
  y: number;
  indexPlayer: string;
};

export type AttackRandom = {
  gameId: string;
  indexPlayer: string;
};

export type AttackFeedback = {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: string;
  status: 'miss' | 'killed' | 'shot';
};

export type Hit = {
  x: number;
  y: number;
};

export type Coord = { x: number; y: number; isHit: boolean };

export type ShipCoord = {
  positions: Coord[];
};

export type Board = Map<string, boolean>;

export type WinnerData = {
  name: string;
  wins: number;
};

export type WinnersData = WinnerData[];

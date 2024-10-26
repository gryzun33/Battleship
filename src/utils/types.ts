export type MessageType =
  | 'reg'
  | 'update_winners'
  | 'create_room'
  | 'update_room'
  | 'add_user_to_room'
  | 'create_game'
  | 'add_ships';

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

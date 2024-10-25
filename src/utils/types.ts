export type MessageType =
  | 'reg'
  | 'update_winners'
  | 'create_room'
  | 'update_room';

export type PlayerReg = {
  name: string;
  password: string;
};

export type PlayerAnswer = {
  name: string;
  index: number | string;
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
  roomId: number | string;
  roomUsers: RoomUser[];
};

export type RoomUser = {
  name: string;
  index: number | string;
};

type MessageType = 'reg' | 'update_winners' | 'create_room';

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

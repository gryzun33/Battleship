import { MessageType, ParsedMessage } from '../types';

export function getFormattedResponse(type: MessageType, data: string): string {
  const response: ParsedMessage = {
    type,
    data,
    id: 0,
  };

  const responseJSON = JSON.stringify(response);
  return responseJSON;
}

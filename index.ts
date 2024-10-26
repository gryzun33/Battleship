import { httpServer } from './src/http_server/index';
import { WebSocketServer } from 'ws';
import { ParsedMessage } from './src/utils/types';
import { randomUUID } from 'crypto';
import { clientManager } from './src/state/clientManager';
import { handleRegistration } from './src/requestHandlers/handleRegistration';
import { handleCreateRoom } from './src/requestHandlers/handleCreateRoom';
import { handleAddUserToRoom } from './src/requestHandlers/handleAddUserToRoom';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('ws connection');
  const clientId = randomUUID();

  ws.on('message', (message: string) => {
    console.log(`getMessage: ${message}`);
    const parsedMessage = JSON.parse(message) as ParsedMessage;

    const { type, data } = parsedMessage;
    switch (type) {
      case 'reg':
        handleRegistration(ws, data, clientId);
        break;

      case 'create_room':
        handleCreateRoom(ws, clientId);
        break;
      case 'add_user_to_room':
        handleAddUserToRoom(ws, data, clientId);
        break;

      default:
        console.warn('Unknown message type:', type);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });
});

wss.on('listening', () => {
  console.log(`WebSocket server is running on port ${WS_PORT}`);
});

// if (player && player.data) {
//   const playerData = JSON.parse(player.data);

//   if (playerData.name) {
//     console.log('Player name:', playerData.name);

//     const responsedata: PlayerAnswer = {
//       name: playerData.name,
//       index: 1,
//       error: false,
//       errorText: '',
//     };

//     const responsetojson = JSON.stringify(responsedata);

//     const response: ParsedMessage = {
//       type: 'reg',
//       data: responsetojson,
//       id: 0,
//     };

//     console.log('Sending response:', response);
//     const JSONresponse = JSON.stringify(response);

//     ws.send(JSONresponse);
//   } else {
//     console.error('Player name is missing');
//     const errorResponse = {
//       type: 'error',
//       data: {
//         error: true,
//         errorText: 'Player name is missing',
//       },
//       id: 0,
//     };
//     ws.send(JSON.stringify(errorResponse));
//   }
// }

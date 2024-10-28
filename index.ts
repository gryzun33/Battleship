import { httpServer } from './src/http_server/index';
import { WebSocketServer } from 'ws';
import { ParsedMessage } from './src/utils/types';
import { randomUUID } from 'crypto';
import { stateManager } from './src/state/clientManager';
import { handleRegistration } from './src/requestHandlers/handleRegistration';
import { handleCreateRoom } from './src/requestHandlers/handleCreateRoom';
import { handleAddUserToRoom } from './src/requestHandlers/handleAddUserToRoom';
import { handleAddShips } from './src/requestHandlers/handleAddShips';
import { handleAttack } from './src/requestHandlers/handleAttack';
import { handleRandomAttack } from './src/requestHandlers/handleRandomAttack';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  const clientId = randomUUID();
  console.log(`ws client connection with id ${clientId} opened`);

  ws.on('message', (message: string) => {
    const parsedMessage = JSON.parse(message) as ParsedMessage;

    const { type, data } = parsedMessage;
    console.log('request type = ', type);
    switch (type) {
      case 'reg':
        handleRegistration(ws, data, clientId);
        break;
      case 'create_room':
        handleCreateRoom(clientId);
        break;
      case 'add_user_to_room':
        handleAddUserToRoom(ws, data, clientId);
        break;
      case 'add_ships':
        handleAddShips(ws, data, clientId);
        break;
      case 'attack':
        handleAttack(ws, data, clientId);
        break;
      case 'randomAttack':
        handleRandomAttack(ws, data, clientId);
        break;
      default:
        console.warn('Unknown message type:', type);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });

  ws.on('close', () => {
    stateManager.removeClient(clientId);
    console.log(`ws client connection with id ${clientId} closed`);
  });
});

wss.on('listening', () => {
  console.log(`WebSocket server is running on port ${WS_PORT}`);
});

const closeProgram = async () => {
  const closePromises = [...wss.clients].map((client) => {
    return new Promise<void>((resolve) => {
      client.close(1000);

      resolve();
    });
  });

  await Promise.all(closePromises);

  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
};

process.on('SIGINT', closeProgram);

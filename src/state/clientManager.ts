import { WebSocket } from 'ws';

interface ClientData {
  ws: WebSocket;
  name?: string;
  password?: string | number;
}

class ClientManager {
  private clients: Map<string, ClientData> = new Map();

  public addClient(clientId: string, ws: WebSocket): void {
    this.clients.set(clientId, { ws });
  }

  public getClient(clientId: string): ClientData | undefined {
    return this.clients.get(clientId);
  }

  public updateClient(clientId: string, data: Partial<ClientData>): void {
    const clientData = this.clients.get(clientId);
    if (clientData) {
      this.clients.set(clientId, { ...clientData, ...data });
    }
  }

  public removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  public getAllClients(): Map<string, ClientData> {
    return this.clients;
  }
}

export const clientManager = new ClientManager();

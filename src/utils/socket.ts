import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
  HubConnectionState,
} from "@microsoft/signalr";
import { endpoints } from "../store/endpoints";
import { Encryption } from "./encryption";

export class OliveSocket {
  private connection: HubConnection;
  private notificationCallback?: (message: string) => void;

  constructor(socketUrl: string) {
    const token = Encryption.decrypt(
      localStorage.getItem("********") as string
    );
    const url = `${socketUrl}${
      endpoints.PaymentNotification
    }?access_token=${token?.replace(/"/g, "")}`;

    this.connection = new HubConnectionBuilder()
      .withUrl(url, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on(
      endpoints.ReceivePaymentNotification,
      (message: string) => {
        if (this.notificationCallback) {
          this.notificationCallback(message);
        }
      }
    );
  }

  public receiveNotification(callback: (message: string) => void): void {
    this.notificationCallback = callback;
  }

  public async startConnection(): Promise<void> {
    try {
      await this.connection.start().catch();
    } catch {
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public async sendMessage(message: string): Promise<void> {
    if (this.connection.state === HubConnectionState.Connected) {
      try {
        await this.connection.invoke("SendMessage", message);
      } catch {}
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection.state === HubConnectionState.Connected) {
      await this.connection.stop();
    }
  }
}

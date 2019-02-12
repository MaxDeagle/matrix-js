import { Injectable } from '@angular/core';
import sdk from 'matrix-js-sdk';
import crypto from 'crypto-js'
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  client: any;
  roomId: string;
  api = 'https://matrix-prod.tech-stm.net';
  state: any;
  accessToken: string;
  userId: string;

  messages: Subject<string> = new Subject<string>();

  testRoomId = '!qmSOPzGBCXisLhlrWE:matrix-prod.tech-stm.net';


  constructor() { }

  public login(username): Observable<string> {
    this.client = sdk.createClient({
      baseUrl: this.api
    });

    const password = crypto.MD5(username).toString();

    this.client.loginWithPassword(username, password).then((res) => {
      this.accessToken = res.access_token;
      this.userId = res.user_id;
      this.beginSync();
    }).catch((err) => {
      console.log(err);
    })

    return this.messages.asObservable();
  }

  public sendMessage(content) {
    if (!this.accessToken) {
      return
    }
    this.client.sendEvent(this.testRoomId, "m.room.message", content, "").then((res) => {
      // message sent successfully
    //  console.log(res);
      console.log(res)
    }).catch((err) => {
      console.log(err);
    });
  }

  private beginSync() {
    this.client.startClient();

    this.addListeners();

    this.client.once('sync', (state, prevState, res) => {
      console.log(state); // state will be 'PREPARED' when the client is ready to use
      this.state = state;
    });
  }

  private addListeners() {
    this.client.on("Room.timeline", (event) => {
      if (event.getType() !== "m.room.message" || event.getRoomId() !== this.testRoomId) {
        return;
      }
      //     console.log(event.getType());
      this.messages.next(event.event.content.body);
      console.log({ event });
    })
  }
}

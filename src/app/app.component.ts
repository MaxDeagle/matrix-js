import { Component } from '@angular/core';
import { MatrixService } from './matrix.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: string;
  message: string;
  messages = [];

  constructor(private matrix: MatrixService) {}

  login() {
    this.matrix.login(this.user).subscribe((message) => {
      this.messages.push(message);
      // Hello there
    });
  }

  sendMessage() {
    const content = {
      'body': this.message,
      'msgtype': 'm.text'
    }
    this.matrix.sendMessage(content);
  }

}

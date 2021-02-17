import { Component } from '@angular/core';
import { PeopleService } from './people.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private people: PeopleService) {
    this.people.getData();
  }
}

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PeopleService } from '../people.service';
import { Person } from '../types';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  allPeople: Observable<Person[]>;
  allGenders: Observable<string[]>;
  constructor(private people: PeopleService) {
    this.allPeople = this.people.$allPeople;
    this.allGenders = this.people.$allGenders;
  }

  delete(id: number) {
    this.people.delete(id);
  }
}

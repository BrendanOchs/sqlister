import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PeopleService } from '../people.service';
import { Person } from '../types';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  peopleData: Observable<Person[]>;
  constructor(private ps: PeopleService) { 
    this.peopleData = this.ps.results;
  }
}

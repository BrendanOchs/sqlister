import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { PeopleService } from '../people.service';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  youngestPerson: any;
  oldestPerson: any;
  averageAgePeople: any;

  youngestData: any;
  oldestData: any;
  averageAgeData: any;

  dates: Observable<any>;

  constructor(private ps: PeopleService) {
    this.youngestData = this.ps.youngestData;
    this.oldestData = this.ps.oldestData;
    this.averageAgeData = this.ps.averageData;
  }

}

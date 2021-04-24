import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PeopleService } from '../people.service';
import { Person } from '../types';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  youngestData: Observable<string>;
  oldestData: Observable<string>;
  averageData: Observable<string>;

  constructor(private ps: PeopleService) {
    this.youngestData = this.ps.youngestData;
    this.oldestData = this.ps.oldestData;
    this.averageData = this.ps.averageData;
  }

}

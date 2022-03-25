import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PeopleService } from '../people.service';
import { DistinctAges } from '../types';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  youngestData: Observable<string>;
  oldestData: Observable<string>;
  averageData: Observable<string>;
  data: Observable<DistinctAges>;
  totalPeople: Observable<number>;

  constructor(private ps: PeopleService) {
    this.youngestData = this.ps.youngestData;
    this.oldestData = this.ps.oldestData;
    this.averageData = this.ps.averageData;
    this.data = this.ps.distinctAges;
    this.totalPeople = this.data.pipe(
      map(({ageOccurances, labels}) => ageOccurances.reduce((acc, val) => acc + val))
    )
  }

}

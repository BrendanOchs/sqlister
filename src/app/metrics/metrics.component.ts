import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../people.service';
import { Observable } from 'rxjs';
import { DistinctAges } from '../types';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  data: Observable<DistinctAges>;
  totalPeople: Observable<number>;

  constructor(private ps: PeopleService) { }
  
  ngOnInit() {
    this.data = this.ps.distinctAges;
    this.totalPeople = this.data.pipe(
      map(({ageOccurances, labels}) => ageOccurances.reduce((acc, val) => acc + val))
    )
  }
}

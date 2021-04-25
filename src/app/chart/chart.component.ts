import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../people.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  data: Observable<{labels: string[], ageOccurances: number[]}>;

  constructor(private ps: PeopleService) { }
  
  ngOnInit() {
    this.data = this.ps.distinctAges;
  }
}

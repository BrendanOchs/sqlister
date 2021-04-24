import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PeopleService } from '../people.service';
import { Chart } from 'chart.js';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  doughnutChart: Chart;

  distinctAges: Observable<number[]>;
  flooredAges: Observable<number[]>;

  data: Observable<[number[], number[]]>;

  constructor(private ps: PeopleService) {
  }
  
  ngOnInit() {
    this.flooredAges = this.ps.peopleAge.pipe(
      map(people => {
      return people.map(person=> Math.floor(person.age / 10) * 10);
      }),
      shareReplay()
    );
    this.distinctAges = this.flooredAges.pipe(
      map(ages => ages.sort(function (a, b) { return a - b })),
      shareReplay()
    );
    this.data = combineLatest([this.flooredAges, this.distinctAges]).pipe(
      tap(([floorAges, distinctAges]) => {
        const labels = [ (distinctAges[0] == 0 ? '>0' : distinctAges[0].toString()), ...distinctAges.map(age => age.toString()).slice(1)]
        const ageOccurances: number[] = [];
        distinctAges.forEach((age, i) => {
          for (let j = 0; j < floorAges.length; j++) {
            if (floorAges[j] == distinctAges[i])
              ageOccurances[i] > 0 ? ageOccurances[i] += 1 : ageOccurances[i] = 1;
          }
        })
        console.log('labels', labels)
        console.log('ageOccur', ageOccurances)
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              label: 'Ages',
              data: ageOccurances,
              backgroundColor: this.getBackGroundColors()
            }]
          }
        });
      })
    );
  }

  getBackGroundColors() {
    const colors = [];
    this.distinctAges.forEach(() => {
      colors.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16))
    });
    return colors;
  }

}

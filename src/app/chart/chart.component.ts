import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { PeopleService } from '../people.service';
import { Chart } from 'chart.js';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  doughnutChart: Chart;

  distinctAges: Observable<number[]>;
  flooredAges: Observable<number[]>;

  data: Observable<[number[], number[]]>;

  subs: Subscription[];

  constructor(private ps: PeopleService) {
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

    this.data = combineLatest([this.flooredAges, this.distinctAges]);
  }

  ngAfterViewInit() {  
    this.createDoughnutChart();
  }

  createDoughnutChart() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.createLabels(),
        datasets: [{
          label: 'Ages',
          data: this.getAgeOccurances(),
          backgroundColor: this.getBackGroundColors()
        }]
      }
    });
  }

  createLabels() {
    const sub = this.distinctAges.subscribe(disAge => {
      return [ disAge[0] == 0 ? '>0' : disAge[0], ...disAge.map(age => age.toString()).slice(1)]
    });
    this.subs.push(sub);
  }

  getAgeOccurances() {
    const ageOccurances: number[] = [];
    const sub = combineLatest([this.distinctAges, this.flooredAges]).subscribe(([disAges, floAges]) => {
      disAges.forEach((age, i) => {
        for (let j = 0; j < floAges.length; j++) {
          if (floAges[j] == disAges[i])
            ageOccurances[i] > 0 ? ageOccurances[i] += 1 : ageOccurances[i] = 1;
        }
      })
    });
    this.subs.push(sub);
    return ageOccurances;
  }

  getBackGroundColors() {
    const colors = [];
    this.distinctAges.forEach(() => {
      colors.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16))
    });
    return colors;
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}

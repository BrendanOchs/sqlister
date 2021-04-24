import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { PeopleService } from '../people.service';
import { Chart } from 'chart.js';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  doughnutChart: Chart;

  distinctAges: Observable<number[]>;
  flooredAges: Observable<number[]>;

  data: Observable<any>;

  sub: Subscription;

  constructor(private ps: PeopleService, private cdr: ChangeDetectorRef) { }
  
  ngAfterViewInit() {
    this.sub = this.ps.distinctAges.pipe(
      tap(({ labels, ageOccurances }) => {
        console.log('cool stuff', labels, ageOccurances)
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              label: 'Ages',
              data: ageOccurances,
              backgroundColor: this.getBackGroundColors(labels)
            }]
          }
        });
        this.cdr.detectChanges();
      })
    ).subscribe()
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  getBackGroundColors(labels: string[]) {
    const colors = [];
    labels.forEach(() => {
      colors.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16))
    });
    return colors;
  }

}

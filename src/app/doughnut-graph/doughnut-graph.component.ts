import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-doughnut-graph',
  templateUrl: './doughnut-graph.component.html',
  styleUrls: ['./doughnut-graph.component.scss'],
})
export class DoughnutGraphComponent implements AfterViewInit {
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  @Input() data(data: {labels: string[], ageOccurances: number[]}) {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Ages',
          data: data.ageOccurances,
          backgroundColor: this.getBackGroundColors(data.labels)
        }]
      }
    });
  };
  doughnutChart: Chart;
  constructor() { }

  ngAfterViewInit() {
  }

  getBackGroundColors(labels: string[]) {
    const colors = [];
    labels.forEach(() => {
      colors.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16))
    });
    return colors;
  }

}

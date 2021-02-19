import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PeopleService } from '../people.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  doughnutChart: Chart;

  distinctAges: number[];
  flooredAges: number[];

  constructor(private ps: PeopleService) {
    this.flooredAges = this.ps.peopleAge.map(person => Math.floor(person.age / 10) * 10);
    this.distinctAges = [...new Set(this.flooredAges)].sort(function (a, b) { return a - b });
  }

  ngAfterViewInit() {  
    this.createDoughnutChart();
  }

  createDoughnutChart() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [ this.distinctAges[0] == 0 ? '>0' : this.distinctAges[0], ...this.distinctAges.map(age => age.toString()).slice(1)],
        datasets: [{
          label: 'Ages',
          data: this.getAgeOccurances(),
          backgroundColor: this.getBackGroundColors()
        }]
      }
    });
  }

  getAgeOccurances() {
    const ageOccurances: number[] = [];
    this.distinctAges.forEach((age, i) => {
      for (let j = 0; j < this.flooredAges.length; j++) {
        if (this.flooredAges[j] == this.distinctAges[i])
          ageOccurances[i] > 0 ? ageOccurances[i] += 1 : ageOccurances[i] = 1;
      }
    })
    return ageOccurances;
  }

  getBackGroundColors() {
    const colors = [];
    this.distinctAges.forEach(() => {
      colors.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16))
    });
    return colors;
  }

  ngOnInit() { }

}

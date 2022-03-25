import { Component, Input, OnInit } from '@angular/core';
import { DistinctAges } from '../types';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent {
  @Input() data: DistinctAges;
  @Input() totalPeople: number;
  constructor() { }

  getRandomColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }

}

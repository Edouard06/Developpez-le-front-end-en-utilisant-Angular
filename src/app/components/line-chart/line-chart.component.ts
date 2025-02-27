import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxChartModule } from 'jqwidgets-ng/jqxchart';

export interface LineChartData {
  year: string;
  medals: number;
}

export interface ChartAxis {
  dataField?: string;
  unitInterval?: number;
  tickMarks: { visible: boolean };
  gridLines: { visible: boolean };
  minValue?: number;
}

export interface Series {
  dataField: string;
  displayText?: string;
  labelsVisible: boolean;
}

export interface SeriesGroup {
  type: string;
  series: Series[];
}

export interface LineChartSettings {
  title: string;
  description: string;
  enableAnimations: boolean;
  showLegend: boolean;
  source: LineChartData[];
  xAxis: ChartAxis;
  valueAxis: ChartAxis;
  seriesGroups: SeriesGroup[];
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, jqxChartModule]
})
export class LineChartComponent {
  @Input() settings!: LineChartSettings;
}

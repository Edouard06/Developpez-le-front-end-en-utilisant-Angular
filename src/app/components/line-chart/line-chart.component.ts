import { Component, Input } from '@angular/core';
import { jqxChartModule } from 'jqwidgets-ng/jqxchart';
import { CommonModule } from '@angular/common';  

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
  template: `
    <div style="width: 100%; max-width: 600px; margin: auto;" *ngIf="settings">
      <jqxChart 
        [width]="'100%'" 
        [height]="400"
        [title]="settings.title"
        [description]="settings.description"
        [enableAnimations]="settings.enableAnimations"
        [showLegend]="settings.showLegend"
        [source]="settings.source"
        [xAxis]="settings.xAxis"
        [seriesGroups]="settings.seriesGroups">
      </jqxChart>
    </div>
  `,
  standalone: true,
  imports: [jqxChartModule, CommonModule]
})
export class LineChartComponent {
  @Input() settings!: LineChartSettings;
}

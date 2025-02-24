import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { jqxChartComponent, jqxChartModule } from 'jqwidgets-ng/jqxchart';

export interface ChartData {
  country: string;
  medals: number;
}

export interface PieChartSettings {
  title: string;
  description: string;
  enableAnimations: boolean;
  showLegend: boolean;
  source: ChartData[];
  colorScheme: string;
  seriesGroups: Array<{
    type: string;
    showLabels: boolean;
    showToolTips: boolean;
    labelFormat: string;
    formatFunction: (value: number, itemIndex: number) => string;
    toolTipFormatFunction: (value: number, itemIndex: number) => string;
    series: Array<{
      dataField: string;
      labelRadius: number;
      initialAngle: number;
      radius: number;
      centerOffset: number;
    }>;
  }>;
}

export interface JqxChartEventArgs {
  elementIndex?: number;
}

export interface JqxChartEvent {
  args?: JqxChartEventArgs;
}

@Component({
  selector: 'app-pie-chart',
  template: `
    <div style="width: 100%; max-width: 600px; margin: auto;" *ngIf="settings">
      <jqxChart #chart
        [width]="'100%'"
        [height]="400"
        [title]="settings.title"
        [description]="settings.description"
        [enableAnimations]="settings.enableAnimations"
        [showLegend]="settings.showLegend"
        [source]="settings.source"
        [colorScheme]="settings.colorScheme"
        [seriesGroups]="settings.seriesGroups"
        (onClick)="handleChartClick($event)">
      </jqxChart>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, jqxChartModule]  
})
export class PieChartComponent {
  @Input() settings!: PieChartSettings;
  @Output() chartClick = new EventEmitter<JqxChartEvent>();

  @ViewChild('chart', { static: false }) chart!: jqxChartComponent;

  handleChartClick(event: JqxChartEvent): void {
    if (this.chart) {
      this.chart.hideToolTip(0);
    }
    this.chartClick.emit(event);
  }
}

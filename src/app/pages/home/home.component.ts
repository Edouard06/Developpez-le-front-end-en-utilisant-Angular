// ... vos imports existants
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/olympic';
import { ChartData, PieChartSettings } from 'src/app/components/pie-chart/pie-chart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  public countries: OlympicCountry[] = [];
  public chartData: ChartData[] = [];
  public pieChartSettings!: PieChartSettings;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.olympicService.getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: OlympicCountry[] | null) => {
        if (data) {
          this.countries = data;
          this.prepareChartData();
          this.configurePieChart();
        }
      });
  }

  private prepareChartData(): void {
    this.chartData = this.countries.map((country: OlympicCountry): ChartData => ({
      country: country.country,
      medals: country.participations.reduce((sum: number, p) => sum + p.medalsCount, 0)
    }));
  }

  private configurePieChart(): void {
    this.pieChartSettings = {
      title: "Total des médailles par pays",
      description: "Visualisation du nombre total de médailles pour chaque pays",
      enableAnimations: true,
      showLegend: true,
      source: this.chartData,
      colorScheme: 'scheme01',
      seriesGroups: [
        {
          type: 'pie',
          showLabels: true,
          showToolTips: true,
          labelFormat: 'custom',
          formatFunction: (value: number, itemIndex: number): string => {
            return this.chartData[itemIndex].country;
          },
          toolTipFormatFunction: (value: number, itemIndex: number): string => {
            return `${this.chartData[itemIndex].country}: ${value} médailles`;
          },
          series: [
            {
              dataField: 'medals',
              labelRadius: 120,
              initialAngle: 15,
              radius: 120,
              centerOffset: 0
            }
          ]
        }
      ]
    };
  }

  public onChartClick(event: any): void {
    const args = event.args;
    if (args && typeof args.elementIndex === 'number') {
      const index: number = args.elementIndex;
      const selectedCountry: OlympicCountry | undefined = this.countries[index];
      if (selectedCountry) {
        this.router.navigate(['/detail', selectedCountry.id]);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

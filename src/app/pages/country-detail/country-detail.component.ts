import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/olympic';

interface LineChartData {
  year: string;
  medals: number;
}

interface ChartAxis {
  dataField?: string;
  unitInterval?: number;
  tickMarks: { visible: boolean };
  gridLines: { visible: boolean };
  minValue?: number;
}

interface Series {
  dataField: string;
  displayText?: string;
  labelsVisible: boolean;
}

interface SeriesGroup {
  type: string;
  series: Series[];
}

interface LineChartSettings {
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
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
  standalone: false
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  public countryId!: number;
  public countryData?: OlympicCountry;
  public lineChartData: LineChartData[] = [];
  public lineChartSettings: LineChartSettings | null = null;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idParam: string | null = params.get('id');
      if (idParam) {
        this.countryId = +idParam;
        this.loadCountryData();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private loadCountryData(): void {
    this.olympicService.getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((countries: OlympicCountry[] | null) => {
        if (countries) {
          this.countryData = countries.find((c: OlympicCountry) => c.id === this.countryId);
          if (this.countryData) {
            this.prepareChartData();
            this.configureLineChart();
          }
        }
      });
  }

  private prepareChartData(): void {
    this.lineChartData = this.countryData!.participations.map(p => ({
      year: p.year.toString(),
      medals: p.medalsCount
    }));
  }

  private configureLineChart(): void {
    this.lineChartSettings = {
      title: "Évolution des médailles",
      description: "Nombre de médailles par édition",
      enableAnimations: true,
      showLegend: true,
      source: this.lineChartData,
      xAxis: {
        dataField: 'year',
        unitInterval: 20,
        tickMarks: { visible: true },
        gridLines: { visible: true }
      },
      valueAxis: {
        minValue: 0, 
        tickMarks: { visible: true },
        gridLines: { visible: true }
      },
      seriesGroups: [
        {
          type: 'line',
          series: [
            {
              dataField: 'medals',
              displayText: 'Médailles',
              labelsVisible: false
            }
          ]
        }
      ]
    };
  }

  public getTotalMedals(): number {
    return this.countryData
      ? this.countryData.participations.reduce((sum: number, p) => sum + p.medalsCount, 0)
      : 0;
  }

  public getTotalAthletes(): number {
    return this.countryData
      ? this.countryData.participations.reduce((sum: number, p) => sum + p.athleteCount, 0)
      : 0;
  }

  public goBack(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/olympic';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
  standalone: false
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  countryId!: number;
  countryData!: OlympicCountry | undefined;
  subscription!: Subscription;
  // Données pour le graphique en ligne
  lineChartData: any[] = [];
  // Configuration du jqxChart pour le line chart
  lineChartSettings: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.countryId = +idParam;
        this.olympicService.getOlympics().subscribe((countries) => {
          if (countries) {
            this.countryData = countries.find(c => c.id === this.countryId);
            if (this.countryData) {
              // Préparation des données : pour chaque participation, créer un objet { year, medals }
              this.lineChartData = this.countryData.participations.map(p => ({
                year: p.year.toString(),
                medals: p.medalsCount
              }));

              // Configuration du jqxChart pour un graphique en ligne
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
                seriesGroups: [
                  {
                    type: 'line',
                    series: [
                      { dataField: 'medals', displayText: 'Médailles', labelsVisible: false }
                    ]
                  }
                ]
              };
            }
          }
        });
      } else {
        // Redirection vers le Dashboard en cas d'absence d'id
        this.router.navigate(['/']);
      }
    });
  }

  getTotalMedals(): number {
    return this.countryData ? this.countryData.participations.reduce((sum, p) => sum + p.medalsCount, 0) : 0;
  }

  getTotalAthletes(): number {
    return this.countryData ? this.countryData.participations.reduce((sum, p) => sum + p.athleteCount, 0) : 0;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

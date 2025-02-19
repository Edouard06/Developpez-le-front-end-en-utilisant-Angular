import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  countries: OlympicCountry[] = [];
  // Données formatées pour le chart
  chartData: any[] = [];
  // Objet de configuration pour jqxChart (pie chart)
  pieChartSettings: any;

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((data) => {
      if (data) {
        this.countries = data;
        // Calculer le total des médailles pour chaque pays
        // this.chartData = data.map(country => ({
        //   country: country.country,
        //   medals: country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
        // }));

        this.chartData = data.map(country => ({
          country: country.country,
          medals: Array.isArray(country.participations)
            ? country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
            : 0
        }));
        

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
              // Afficher les labels sur les tranches
              showLabels: true,
              // Afficher un tooltip au survol
              showToolTips: true,
              series: [
                {
                  dataField: 'medals',
                  displayText: 'country',
                  labelRadius: 120,
                  initialAngle: 15,
                  radius: 120,
                  centerOffset: 0,
                  /** 
                   * formatFunction : détermine le texte affiché 
                   * directement sur la tranche. 
                   */
                  formatFunction: (value: any, itemIndex: number, series: any, group: any) => {
                    // Ici, on n'affiche que le nom du pays
                    return this.chartData[itemIndex].country;
                  },
                  /**
                   * toolTipFormatFunction : détermine le texte du tooltip 
                   * lors du survol d'une tranche.
                   */
                  toolTipFormatFunction: (
                    value: any,
                    itemIndex: number,
                    series: any,
                    group: any,
                    categoryValue: any,
                    categoryAxis: any
                  ) => {
                    // Affiche "Pays : X médailles"
                    return this.chartData[itemIndex].country + ": " + value + " médailles";
                  }
                }
              ]
            }
          ]
        };
      }
    }
    );
  }
        
        

  onChartClick(event: any): void {
    // Affichez l'événement dans la console pour vérifier sa structure
    console.log('onChartClick event:', event);
    
    // Selon la documentation, event.args.elementIndex contient l'index du secteur cliqué
    if (event.args && typeof event.args.elementIndex === 'number') {
      const index = event.args.elementIndex;
      const selectedCountry = this.countries[index];
      if (selectedCountry) {
        this.router.navigate(['/detail', selectedCountry.id]);
      }
    }
  }
}

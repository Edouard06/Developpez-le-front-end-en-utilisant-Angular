import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { jqxChartModule } from 'jqwidgets-ng/jqxchart';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,        
    CountryDetailComponent  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    jqxChartModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

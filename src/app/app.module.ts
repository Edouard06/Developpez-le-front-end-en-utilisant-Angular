import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { jqxChartModule } from 'jqwidgets-ng/jqxchart';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';
@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, CountryDetailComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, jqxChartModule ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

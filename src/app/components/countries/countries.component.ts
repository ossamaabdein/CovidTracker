import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountryData } from 'src/app/models/country-data';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {

  constructor(private _DataService: DataService, private _NgxSpinnerService: NgxSpinnerService) { }

  firstType = ChartType.LineChart;
  countriesList: string[] = [];
  data: any = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  countriesData: any;
  selectedCountry: CountryData[] = [];
  dataTable: any = [];

  chart = {
    height: 400,
    width: 700, 
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
    }  
  } 

  ngOnInit(): void {
    // loading screen settings
    this._NgxSpinnerService.show();
    setTimeout(() => {
      this._NgxSpinnerService.hide();
    }, 2000);
    this._DataService.getCountriesData().subscribe((result:any) => {
      this.countriesData = result
      // initial data 
      this.selectedCountry = this.countriesData['Afghanistan'].reverse();
      this.updateChart()      
    })

    this._DataService.getGlobalData().subscribe((result:any) => {
      // remove first row [titles]
      result.splice(0,1);
      this.data = result
      // initial values  
      this.totalConfirmed = this.data[0].confirmed;
      this.totalDeaths = this.data[0].deaths;
      this.data.forEach((el: any) => {
        if (el.country != null) {
          if (el.country == 'Israel') {
            el.country = 'Palestine';
          }
          this.countriesList.push(el.country);
        }
      });
    })
  }
  
  updateChart() {
    this.dataTable = [];
    this.selectedCountry.forEach((country:any) => {
      this.dataTable.push([country.cases, country.date]);
    })
  }

  updateValues(input: string) {
    this.data.forEach((el:any) => {
      if(el.country == input) {
        this.totalConfirmed = el.confirmed;
        this.totalDeaths = el.deaths;
      } 
    })

    this.selectedCountry = this.countriesData[input].reverse();
    this.updateChart()    
  }

// calc. increase rate in cases
  subtract(x:any, y: any) {
    return  x - y;
  }
}

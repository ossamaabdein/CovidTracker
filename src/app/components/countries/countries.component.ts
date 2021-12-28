import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { CountryData } from 'src/app/models/country-data';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {

  firstType = ChartType.LineChart;

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



  countriesList: string[] = [];
  data: any = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  countriesData: any;
  selectedCountry: CountryData[] = [];
  dataTable: any = []

  constructor(private _DataService: DataService) { }

  ngOnInit(): void {
    this._DataService.getCountriesData().subscribe((result:any) => {
      this.countriesData = result
      // initial data 
      this.selectedCountry = this.countriesData['Afghanistan'].reverse();
      // let x = this.selectedCountry;
      // console.log(this.dataTable);
      this.updateChart()      
    })

    this._DataService.getGlobalData().subscribe((result:any) => {
      result.splice(0,1);
      this.data = result
      // initial values  
      this.totalConfirmed = this.data[0].confirmed;
      this.totalDeaths = this.data[0].deaths;
      this.totalActive = this.data[0].active;
      this.totalRecovered = this.data[0].recovery;
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
      this.dataTable.push([country.cases, country.date])
    })
    console.log(this.dataTable)
  }

  updateValues(input: string) {
    this.data.forEach((el:any) => {
      if(el.country == input) {
        this.totalConfirmed = el.confirmed;
        this.totalDeaths = el.deaths;
        this.totalActive = el.active;
        this.totalRecovered = el.recovery;
      } 
    })

    this.selectedCountry = this.countriesData[input].reverse();
    this.updateChart()    
  }

  subtract(x:any, y: any) {
    return x - y;
  }
}

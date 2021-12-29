import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { GlobalDataSummary } from '../models/global-data';
import { CountryData } from '../models/country-data';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  // dataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/8ea53ad40b93d4be5cb7fe63d3d5b9f860c1ddaa/csse_covid_19_data/csse_covid_19_daily_reports/12-22-2021.csv'
  dataUrl =    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-27-2021.csv'
  countriesUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
  
  constructor(private _HttpClient: HttpClient) { }

  getGlobalData() {
    return this._HttpClient.get(this.dataUrl, {responseType: 'text'}).pipe(map(result => {
      // let data : GlobalDataSummary[] = [];
      let raw: any = {};
      
      let rows = result.split('\n');
      
      // rows.splice(0,1);
      rows.forEach(row => {
        // RegEx to separate if comma is not followed by space (as the last col of row containts many values separated by comma 
        // and we dont`t want to separate them in multiple cols)
        let cols = row.split(/,(?=\S)/)
        // '+' converts to number
        let cs =  {country: cols[3], confirmed: +cols[7], deaths: +cols[8], recovery: +cols[9], active: +cols[10]};
        
        // How to merge multiple objects of the same country into one single object [min 00:38] 
        let temp: GlobalDataSummary = raw[cs.country];
        if (temp) {
          temp.active = cs.active + temp.active!;
          temp.confirmed = cs.confirmed + temp.confirmed!;
          temp.deaths = cs.deaths + temp.deaths!;
          temp.recovery = cs.recovery + temp.recovery!;
          raw[cs.country] = temp;
        } else {
          raw[cs.country] = cs;
        }
      })
      return Object.values(raw);
    }))
  }

  getCountriesData() {
    return this._HttpClient.get(this.countriesUrl, {responseType: 'text'}).pipe(map(result => {
      let rows = result.split('\n');
      let mainData: any = {};
      let header = rows[0]
      let dates = header.split(/,(?=\S)/);
      dates.splice(0,4)
      // console.log(dates)
      rows.splice(0,1)
      rows.forEach(row => {
        let cols = row.split(/,(?=\S)/)
        let country = cols[1];
        cols.splice(0,4);
        // console.log(country, cols);
        mainData[country] = []
        cols.forEach((value, index) => {
          let dw : CountryData = {
            cases: +value,
            country: country,
            date: new Date(Date.parse(dates[index]))
          }
          mainData[country].push(dw)
        })
      })
      // console.log(mainData)
      return mainData
    }))
  }
}

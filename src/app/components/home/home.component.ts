import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ChartType } from "angular-google-charts";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  firstType = ChartType.PieChart;
  secondType = ChartType.ColumnChart

  chart = {
    // PieChart: 'PieChart',
    // ColumnChart : 'ColumnChart',
    height: 400,
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
    }  
  } 

  globalData:any = [];
  dataTable: any = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;


  constructor(private _DataService: DataService) { }

  ngOnInit(): void {
    this._DataService.getGlobalData().subscribe(result => {
      result.splice(0,1);
      this.globalData = result
      this.globalData.forEach((el: any) => {
        if (el.country == 'Israel') {
          el.country = 'Palestine';
        }
        // Just to make sure none of objects returns NaN
        if (!Number.isNaN(el.confirmed)) {
          this.totalConfirmed += el.confirmed
          this.totalActive += el.active
          this.totalDeaths += el.deaths
          this.totalRecovered += el.recovery
        }
      })
      this.initChart('confirmed')
    })
  }

  initChart(caseType: string) {

    // Important step to update charts
    this.dataTable = [];
    // this.dataTable.push(['country', 'cases']);
    this.globalData.forEach((el: any) => {
      let value: any;
      let con: any;
      if (caseType == 'confirmed') {
          value = el.confirmed        
      }
     if (caseType == 'deaths') {
        value = el.deaths
      }

      if (caseType == 'recovered') {
          value = el.recovery
      }

      if (caseType == 'active') {
          value = el.active
      }
      this.dataTable.push([el.country, value])      
      // this.dataTable.push([con, value])      
    });
    console.log(this.dataTable)

  //   this.pieChart = {
  //   chartType: 'PieChart',
  //   dataTable: dataTable,
  //   options: {height : 600},
  // }

  //   this.columnChart = {
  //     chartType: 'ColumnChart',
  //     dataTable: dataTable,
  //     options: {height : 500}
  //   }


  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value)
    console.log(input.value)
  }

  

}

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ChartType } from "angular-google-charts";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  
  constructor(private _DataService: DataService, private _NgxSpinnerService: NgxSpinnerService) { }
  
  // declaring variables
  firstType = ChartType.PieChart;
  secondType = ChartType.GeoChart;
  thirdType = ChartType.AreaChart;
  globalData:any = [];
  dataTable: any = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;

  chart = {
    height: 500,
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
    }  
  } 

  geoChart = {
    height: 500,
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
      colorAxis: {colors: ['#f8bbd0', 'red'] },
    backgroundColor: '#ebeeee',
    }
  }

  ngOnInit(): void {
    // loading screen settings
    this._NgxSpinnerService.show();
    setTimeout(() => {
      this._NgxSpinnerService.hide();
    }, 2000);
   
    this._DataService.getGlobalData().subscribe(result => {
      // splice first row [titles]
      result.splice(0,1);
      this.globalData = result
      this.globalData.forEach((el: any) => {
        // refactor wrong data
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
    this.globalData.forEach((el: any) => {
      let value: any;
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
    }); 
  }

  // update chart on action
  updateChart(input: HTMLInputElement) {
    this.initChart(input.value)
    console.log(input.value)
  }

  // hide & show some elements depending on screen size
  isMobile() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 768;
  }
}

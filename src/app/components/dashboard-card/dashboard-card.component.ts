import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {

  @Input('totalConfirmed') totalConfirmed: any;
  @Input('totalRecovered') totalRecovered: any;
  @Input('totalDeaths') totalDeaths: any;
  @Input('totalActive') totalActive: any;

  constructor() { }

  ngOnInit(): void {
  }

}

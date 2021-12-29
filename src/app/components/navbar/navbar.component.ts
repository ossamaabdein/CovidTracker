import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isPc() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width > 768;
  }
}

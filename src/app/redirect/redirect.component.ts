import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {
  cookie: string = '';
  cookieSrv: CookieService;

  constructor(private router: Router, private activeRouter: ActivatedRoute, private cookieService: CookieService) {
    this.cookieSrv = cookieService;
    this.activeRouter.queryParams.subscribe(queryParams => {
      this.cookie = queryParams['token'];
      console.log('This is RedirectComponent');
      console.log('this.param =', this.cookie);
      if (this.cookie != null && this.cookie != undefined
        && this.cookie.length > 0 && this.cookieSrv != null) {

        this.cookieSrv.set('AppToken', this.cookie);
        console.log('AppToken = ', this.cookieSrv.get('AppToken'));
      }
    })
  }

  ngOnInit(): void {
    // window.location.href = env.AppInfo.MonitorUrl;   
    // console.log('This is RedirectComponent');
    console.log('Go to realTimeChart !!!');
    this.router.navigateByUrl('/mainboard/realTimeChart');
  }

}

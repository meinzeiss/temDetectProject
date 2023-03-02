import { Component, OnInit } from '@angular/core';
import { HeartCheckService } from '../heart-check-service';
import { LogService } from '../log.service';

@Component({
  selector: 'app-system-status',
  templateUrl: './system-status.component.html',
  styleUrls: ['./system-status.component.css']
})

export class SystemStatusComponent implements OnInit {
  updateSubscriptionHeart: any;
  heartSrv: HeartCheckService;
  logSrv: LogService;
  logInfos: string[] = [];
  logSize: number = 20;

  constructor(heart: HeartCheckService, logger:LogService) { 
    this.heartSrv = heart; 
    this.logSrv = logger;
  }

  ngOnInit(): void {
    this.initLastLogs(this.logSize);
    this.updateSubscriptionHeart = this.heartSrv.getSubject().subscribe(this.updateLogs.bind(this));
  }
  updateLogs(res: any) {
    console.log('checkTask Called');
    let lastLogs = this.logSrv.getLastDataByCnt(this.logSize);
    // console.log(lastLogs);
    this.logInfos = [];
    this.logInfos = this.logInfos.concat(lastLogs).reverse();
    // console.log(this.logInfos);
  }
  initLastLogs(cnt:number){
    this.logInfos.concat(this.logSrv.getLastDataByCnt(this.logSize));
  }
}

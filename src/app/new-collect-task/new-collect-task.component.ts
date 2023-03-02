import { Component, OnInit } from '@angular/core';
import { differenceInCalendarDays, setSeconds } from 'date-fns';
import { DisabledTimeFn, DisabledTimePartial, } from 'ng-zorro-antd/date-picker'
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import * as env from '@environment'
import { HeartCheckService } from '../heart-check-service';
import { NzModalService } from 'ng-zorro-antd/modal';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: 'my-auth-token'
  })
};

@Component({
  selector: 'app-new-collect-task',
  templateUrl: './new-collect-task.component.html',
  styleUrls: ['./new-collect-task.component.css']
})

export class NewCollectTaskComponent implements OnInit {

  desc = '';
  companyName = '';
  time = { hour: 9, minute: 0 };
  placeholder = '';
  date = new Date();
  today = new Date();
  todayHour = new Date().getHours;
  timeDefaultValue = setSeconds(new Date(), 0);
  tomorrow: Date = new Date((new Date().getDay() + 1));
  nowYear: number = new Date().getFullYear();
  nowMon: number = new Date().getMonth();
  nowDay: number = new Date().getDay();
  nowHour: number = new Date().getHours();
  nowMin: number = new Date().getMinutes();
  isToday: boolean = true;
  selectDt?: Date;
  selectDtStr:string = '';
  httpClient: HttpClient;
  heartSrv: HeartCheckService;
  realDtSubscriptionHeart: any;
  hasTask: boolean = false;
  showDlgFlg: boolean = false;
  dlgMsg: string = '';  
  samplingPeriodEnable:boolean = false;
  selectedPeriod:number = 1;
  modal:NzModalService;
  
  constructor(private router: Router, private http: HttpClient, heart: HeartCheckService,private nzModal: NzModalService) {
    this.httpClient = http;
    this.heartSrv = heart;
    this.modal = nzModal;
  }

  ngOnInit(): void {
    this.realDtSubscriptionHeart = this.heartSrv.getSubject().subscribe(this.checkTask.bind(this));
    // console.warn('selectedPeriod =',this.selectedPeriod);       
    this.samplingPeriodEnable = (env.SrvOptions.SamplingPeriodEnable == 'true');
    if(this.samplingPeriodEnable){
      this.selectedPeriod = 60;
    }else{
      this.selectedPeriod = 1;
    }
  }
  checkTask(res: any) {
    // console.log('checkTask Called');
    // console.log(res.RtnData.RunningTask);
    if (res.RtnData != null && res.RtnData != undefined && res.RtnData.RunningTask != null
      && res.RtnData.RunningTask != undefined && res.RtnData.RunningTask.Uid.length > 0) {
      this.hasTask = true;
    } else {
      this.hasTask = false;
    }    
    this.samplingPeriodEnable = (env.SrvOptions.SamplingPeriodEnable == 'true');
    if(!this.samplingPeriodEnable){
      this.selectedPeriod = 1;
    }
    // if(this.samplingPeriodEnable){
    //   this.selectedPeriod = 60;
    // }else{
    //   this.selectedPeriod = 1;
    // }
    // this.selectedPeriod = env.SrvOptions.SamplingPeriod;
    // console.warn('>> samplingPeriodEnable =',this.samplingPeriodEnable);
    // console.log('hasTask = ', this.hasTask);
  }

  addTaskCallBack(res: any) {
    console.log('addTaskCallBack Called');
    console.log(res);
    if (res != undefined && res.Code == 0) {
      this.router.navigateByUrl('/mainboard/realTimeChart');
      env.SrvOptions.SamplingPeriod = this.selectedPeriod;
      // console.log('addTaskCallBack Called,env.SrvOptions.SamplingPeriod = ', env.SrvOptions.SamplingPeriod);
    } else if (res != undefined && res.Code == 7) {
      this.hasTask = true;
      // this.showMsgDlg('已存在执行中任务');
      this.info('已存在执行中任务');
    } else{
      let errCode = res.Code;
      let errInfo = res.ErrInfo;      
      this.warning(`提交失败, 错误码:${errCode}, 描述：${errInfo}`);
      // this.showMsgDlg(`提交失败, 错误码:${errCode}, 描述：${errInfo}`);
    }
  }

  onStartTask() {
    console.log('onStartTask, navigateByUrl ', this.isToday);
    // let timeStr = this.selectDt?.toLocaleString().replace('/', '-').replace('/', '-');
    let timeStr = (this.selectDt != null && this.selectDt != undefined) ? this.formatTime(this.selectDt) : ''
    let params = {
      Desc: this.desc,
      EndTime: timeStr,
      SampleRateSecond: this.samplingPeriodEnable ? this.selectedPeriod : 1,
      CompanyName: this.companyName,
    };
    console.log(params);
    if (this.desc != undefined && this.desc.length > 0
      && timeStr != null && timeStr != undefined && timeStr.length > 0){
        this.http.post(env.url(env.Api_AddTask), params, httpOptions).subscribe(this.addTaskCallBack.bind(this));
    }else{
      // console.log('this.desc',this.desc);
      // console.log('timeStr', timeStr);
      // this.showMsgDlg('请输入有效描述和结束时间');
      this.warning('请输入有效描述和结束时间');
    }
  };

  onChange(result: Date): void {
    console.log('onChange Time: ', result);
    // console.log('onChange Time: ', this.formatTime(result));
    this.selectDtStr = (result != null && result != undefined) ? this.formatTime(result) : '';
    this.selectDt = result;
    console.log('selectDt : ',this.selectDt);
    console.log('selectDtStr : ',this.selectDtStr);
  }

  onOk(result: Date | Date[] | null): void {
    // this.selectDt = result;
    // this.selectDtStr = this.selectDt  ? this.selectDt.toLocaleString().replace('/', '-').replace('/', '-') : '';
    // console.log('onOk Time:', this.selectDt);
  }

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate = (current: Date) => {
    this.isToday = differenceInCalendarDays(current, this.today) == 0;
    console.log('this.isToday: ', this.isToday);
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) < 0;
  }

  // disabledDateTime: DisabledTimeFn = () => ({
  //   nzDisabledHours: () => {
  //     this.nowHour = new Date().getHours();
  //     return (this.isToday ? this.range(0, 24).splice(0, this.nowHour) : []);
  //   },
  //   nzDisabledMinutes: () => {
  //     return [];
  //     // return this.isToday ? this.range(0, 60).splice(0,this.nowMin + 1) : [];
  //   },
  //   // nzDisabledSeconds: () => this.range(0, 60).splice(1,59),
  // });

  disabledDateTime: DisabledTimeFn = (current: Date | Date[], partial?: DisabledTimePartial) => ({
    nzDisabledHours: () => {
      this.nowHour = new Date().getHours();
      return (this.isToday ? this.range(0, 24).splice(0, this.nowHour) : []);
    },
    nzDisabledMinutes: () => {
      return [];
      // return this.isToday ? this.range(0, 60).splice(0,this.nowMin + 1) : [];
    },
    // nzDisabledSeconds: () => this.range(0, 60).splice(1,59),
    nzDisabledSeconds: () => {
      return [];
      // return this.isToday ? this.range(0, 60).splice(0,this.nowMin + 1) : [];
    },
  });
  onSelected(item:string){
    console.warn('1.selectedPeriod =',this.selectedPeriod);
    this.selectedPeriod = Number.parseInt(item);
    console.warn('2.selectedPeriod =',this.selectedPeriod);
  }
  warning(msg:string): void {
    this.modal.warning({
      nzTitle: '提示',
      nzContent: msg,
    });
  }
  info(msg:string): void {
    this.modal.info({
      nzTitle: '提示',
      nzContent: msg,
      nzOnOk: () => console.log('Info OK')
    });
  }
  // showMsgDlg(msg: string) {
  //   this.dlgMsg = msg;
  //   this.showDlgFlg = true;
  // }
  handleOk(): void {
    this.showDlgFlg = false;
  }
  handleCancel(): void {
    this.showDlgFlg = false;
  }
  formatTime = (date: Date): string => {
    var time = '';
    let year: number = date.getFullYear();//年
    let month: number = date.getMonth() + 1;//月
    let day: number = date.getDate();//日
    let hour: number = date.getHours();//小时
    let minute: number = date.getMinutes();//分钟
    let second: number = date.getSeconds();//秒
    time = year + '-' + (month < 10 ? '0' + month : month)
      + '-' + (day < 10 ? '0' + day : day)
      + ' ' + (hour < 10 ? '0' + hour : hour)
      + ':' + (minute < 10 ? '0' + minute : minute)
      + ':' + (second < 10 ? '0' + second : second);
    console.log('formatTime, time = ',time);
    return time;
  };
}
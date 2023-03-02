import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as env from '@environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: 'my-auth-token'
  })
};

@Component({
  selector: 'app-device-maintain',
  templateUrl: './device-maintain.component.html',
  styleUrls: ['./device-maintain.component.css']
})


export class DeviceMaintainComponent implements OnInit {
  maintianDes: string = '';
  isSaving: boolean = false;
  isSetting: boolean = false;
  noticeDaysCnt: string = ''
  maintainDuration: string = ''
  lastMaintainTime: string = ''
  dayRemainingCnt: string = ''
  dialogMsg: string = ''
  http: HttpClient;
  showMsgDialog: boolean = false;
  showOverDays: boolean = false;
  overDaysCnt: string = ''
  showConfirm: boolean = false;
  confirmMsg: string = '';
  confirmType: number = 0;

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }

  ngOnInit(): void {
    this.confirmType = 0;
  }
  ngAfterViewInit(): void {
    this.getMaintainInfo();
  }
  getMaintainInfo() {
    setTimeout(() => {
      let url = env.url(env.Api_CheckMaintain);
      // console.log('FullUrl =',url);
      this.http.get(env.url(env.Api_CheckMaintain)).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => {
          // console.log('error');
          console.warn(e);
        },    // errorHandler 
        next: (res: any) => {
          // console.log(res);
          if (res != null && res != undefined && res.Code == 0
            && res.RtnData != null && res.RtnData != undefined) {
            let lastInfo = res.RtnData.Last;
            let lastDt = new Date(lastInfo);
            let year = lastDt.getFullYear();
            let month = lastDt.getMonth() + 1;
            let day = lastDt.getDay();
            let hour = lastDt.getHours();
            let min = lastDt.getMinutes();
            let second = lastDt.getSeconds();
            let lastTimeStr = year + '-' + month + '-' + day 
                              + ' ' + hour + ':' + min + ':' + second;
            let lastTime = lastDt.getTime() / 1000;// - (60*60*24*90); //for test
            let nowTime = new Date().getTime() / 1000;
            let diffDay = Math.round((nowTime - lastTime) / (60 * 60 * 24));
            let duration = res.RtnData.Duration;
            let notifyDay = res.RtnData.NotifyDay;
            let desc = res.RtnData.Desc;
            // console.log('lastDate =',lastDate);          
            // console.log('diffDay =',diffDay);
            // console.log('duration =',duration);
            // console.log('notifyDay =',notifyDay);
            this.showOverDays = diffDay > duration;
            this.maintianDes = desc;
            this.noticeDaysCnt = notifyDay;
            this.maintainDuration = duration;
            this.lastMaintainTime = lastTimeStr;
            this.dayRemainingCnt = this.showOverDays ? (diffDay - duration).toFixed() : (duration - diffDay).toFixed();

          } else {
            this.dialogMsg = '读取设备维护信息失败';
            this.showDialog();
          }
        },     // nextHandler
      });
    }, 300);
  }
  saveMaintainDes() {
    // let ok = this.checkDesc();
    let ok = true;
    if (ok) {
      this.submitMaintainDes();
    } else {
      this.dialogMsg = '请录入有效内容后尝试提交';
      this.showDialog();
    }
  }
  setMaintainDays() {
    if (this.checkSettingData()) {
      if (this.checkDayRange()) {
        this.submitMaintainDes();
      } else {
        this.dialogMsg = '维护周期需大于提醒天数';
        this.showDialog();
      }
    } else {
      this.dialogMsg = '请录入有效内容后尝试提交';
      this.showDialog();
    }
  }
  // checkDesc() {
  //   let check = false;
  //   if (this.maintianDes != undefined && this.maintianDes.length > 0) {
  //     check = true;
  //   }
  //   return check;
  // }
  checkSettingData() {
    let check = false;
    if (Number.parseInt(this.noticeDaysCnt) > 0 && Number.parseInt(this.maintainDuration) > 0) {
      check = true;
    }
    return check;
  }
  checkDayRange() {
    let check = false;
    if (Number.parseInt(this.maintainDuration) > Number.parseInt(this.noticeDaysCnt)) {
      check = true;
    }
    return check;
  }
  submitMaintainDes() {
    setTimeout(() => {
      let desc = this.maintianDes;
      let params = {
        Desc: desc,
      };
      console.log(params);
      this.http.post(env.url(env.Api_SetMaintainDesc), params, httpOptions).subscribe({
        complete: () => { }, // completeHandler
        error: (e: any) => {
          console.warn(e);
          this.dialogMsg = e;
          this.showDialog();
        },    // errorHandler 
        next: (res: any) => {
          console.log(res);
          this.dialogMsg = '提交成功';
          this.showDialog();
        },     // nextHandler
      });
    }, 200);
  }
  submitMaintainDays() {
    setTimeout(() => {
      let maintainNotifyDay = this.noticeDaysCnt;
      let maintainDuration = this.maintainDuration;
      let params = {
        NotifyDay: maintainNotifyDay,
        Duration: maintainDuration,
      };
      console.log(params);
      this.http.post(env.url(env.Api_SetMaintainConfig), params, httpOptions).subscribe({
        complete: () => { }, // completeHandler
        error: (e: any) => {
          console.warn(e);
          this.dialogMsg = e;
          this.showDialog();
        },    // errorHandler 
        next: (res: any) => {
          console.log(res);
          this.dialogMsg = '提交成功';
          this.showDialog();
        },     // nextHandler
      });
    }, 200);
  }
  submitMaintainOperation() {
    setTimeout(() => {
      this.http.post(env.url(env.Api_SendMaintainOperation), null, httpOptions).subscribe({
        complete: () => { }, // completeHandler
        error: (e: any) => {
          console.warn(e);
          this.dialogMsg = e;
          this.showDialog();
        },    // errorHandler 
        next: (res: any) => {
          console.log(res);
          this.dialogMsg = '提交成功';
          this.showDialog();
          let nowDate = new Date().toLocaleString().replace('/', '-').replace('/', '-');
          this.lastMaintainTime = nowDate;
        },     // nextHandler
      });
    }, 200);
  }
  showConfirmDialog(type: number) {
    let msg = type == 3 ? '请确认是否提交当前维护操作？' :
        (type == 2 ? '请确认是否提交当前设备维护天数设置信息？' :
        (type == 1 ? '请确认是否提交当前说明内容？' : '请确认是否提交当前录入信息？'));
    this.confirmType = type;
    this.confirmMsg = msg;
    this.showConfirm = true;
  }
  confirmOk(): void {
    if (this.confirmType > 0) {
      if (this.confirmType == 3) {
        this.submitMaintainOperation();
      }
    }
    this.showConfirm = false;
  }
  confirmCancel(): void {
    this.showConfirm = false;
  }
  showDialog() {
    this.showMsgDialog = true;
  }
  handleOk(): void {
    this.showMsgDialog = false;
  }
  handleCancel(): void {
    this.showMsgDialog = false;
  }
}

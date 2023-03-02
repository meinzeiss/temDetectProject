import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import * as env from '@environment';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer/drawer-options';
import { ProtobufService } from '../protobuf.service';
import { Buffer } from 'buffer/';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { catchError, Observable, of } from 'rxjs';
import { calcData, HttpReq_GetCalcResult } from '../real-time-chart-view/real-time-chart-view.component';
import { CookieService } from 'ngx-cookie-service';

interface ReqData {
  Code: number;
  ErrInfo: string;
  RtnData: RtnData;
}
interface RtnData {
  CountPerPage: number;
  Data: Task[];
  PageCnt: number;
  PageIndex: number;
}
interface Task {
  Uid: string;
  ITime: string;
  EndTime: string;
  Status: number;
  Desc: string;
}
interface ReqListParams {
  PageIndex: number;
  StartTime: string,
  EndTime: string,
  CountPerPage: number,
}
interface Line {
  name: string;
  type: string;
  // stack: string;
  data: number[];
  animation: boolean;
  smooth: number;
  symbol: string;
  sampling: string;
  step: boolean;
  // label: Label;
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: 'my-auth-token'
  })
};

@Component({
  selector: 'app-history-collected-info8-channel',
  templateUrl: './history-collected-info8-channel.component.html',
  styleUrls: ['./history-collected-info8-channel.component.css']
})
export class HistoryCollectedInfo8ChannelComponent implements OnInit {
  interTime: any;
  hasCookie: boolean = false;
  date = null;
  // listOfData: Task[] = [];
  // listOfCurrentPageData: readonly Task[] = [];
  chartShowFlg: boolean = true;
  calcData: calcData[] = [];
  rangeLeft: any = '';
  rangeRight: any = '';
  isCalcTableLoading: boolean = false;
  dialogMsg: string = '';
  showMsgDialog: boolean = false;
  showDeleteConfirmFlg: boolean = false;
  deleteConfirmInfo: string[] = [];
  currentDelUid: string = '';
  taskTimeStr: string = '';
  message: string = '';
  dateRange: Date[] = [new Date(new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)),
  new Date(new Date().setHours(23, 59, 59, 999))];
  http: HttpClient;
  yMax = 50;
  dataSrc: any;
  dTimeArray: number[] = [];
  timeX: string[] = [];
  timeXOrg: string[] = [];
  taskStartDt: any;
  updateOptions: any;
  colors: string[] = ['#e6194b', '#3cb44b', '#4363db', '#ffe119',
    '#800000', '#9a8324', '#469990', '#000075'];
  legendSelected: boolean[] = [];
  legendSelectedJson: string = '';
  showDetailFlg: boolean = false;
  placement: NzDrawerPlacement = 'bottom';
  taskUid: string = '';
  showLen: number = 120;
  baseUrl: string = env.url(env.Api_TaskDetailDownload);
  samplingPeriodEnable: boolean = false;
  // dynInterval: number = 10;
  protocSrc: ProtobufService;
  cookieSrv: CookieService;
  //
  total = 10;
  listOfTasks: Task[] = [];
  loading = false;
  pageSize = 10;
  pageIndex = 1;
  //  
  markAreaRange: number[] = [-1, -1];
  taskDesc: string = '';
  selectedRangeMsg: string = '';
  xAxisFromZeroFlg: boolean = false;
  allSelectedInPage: boolean = false;
  chkBoxIndeterminate: boolean = false;
  setOfCheckedId = new Set<string>()
  //
  groupCnt:number = 1;
  channelCnt:number = 8;
  //
  onChange(result: Date[]): void {
    // console.log('onChange: ', result);
  }
  constructor(httpClient: HttpClient, protoc: ProtobufService, private cookieService: CookieService) {
    this.http = httpClient; this.protocSrc = protoc; this.cookieSrv = cookieService;
  }

  ngOnInit(): void {
    // this.initTestData();
    this.interTime = setInterval(() => {
      let cookie = this.cookieSrv.get('AppToken');
      if(cookie != null && cookie != undefined && cookie.length > 0){
        this.hasCookie = true;
      }else{
        this.hasCookie = false;
      }
    }, 800);
  }
  onTasksSearch() {
    this.pageIndex = 1;
    this.loadTaskListFromSrv(this.pageIndex, this.pageSize);
  }

  getTasks(
    pageIndex: number,
    pageSize: number,
    startTime: string,
    endTime: string
  ): Observable<{ RtnData: any }> {
    let url = env.url(env.Api_HistoryTasks);
    let params = new HttpParams()
      .append('PageIndex', `${pageIndex > 0 ? pageIndex - 1 : pageIndex}`)
      .append('StartTime', `${startTime}`)
      .append('EndTime', `${endTime}`)
      .append('CountPerPage', `${pageSize}`);
    console.log(params);
    return this.http.get<{ RtnData: any }>(`${url}`, { params }).pipe(catchError(() => of({ RtnData: '' })));
  }

  loadTaskListFromSrv(
    pageIndex: number,
    pageSize: number,
  ): void {
    let startStr = this.getStartTime(this.formatTime(this.dateRange[0]));
    let endStr = this.getEndTime(this.formatTime(this.dateRange[1]));
    console.log(`startStr = ${startStr}, endStr = ${endStr}`);
    // console.log('loadTaskListFromWeb is loading');
    this.loading = true;
    this.getTasks(pageIndex, pageSize, startStr, endStr).subscribe(data => {
      // console.log(data);
      if (data.RtnData != null && data.RtnData != undefined) {
        let pageSize = data.RtnData.CountPerPage;
        let listData = data.RtnData.Data;
        let pageCnt = data.RtnData.PageCnt;
        let pageIndex = data.RtnData.PageIndex + 1;
        // console.log(data.RtnData);
        // console.log('pageCnt = ',pageCnt);
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = pageCnt * pageSize;
        this.listOfTasks = listData;
      } else {
        this.pageIndex = 1;
        this.pageSize = 10;
        this.total = 10;
        this.listOfTasks = [];
      }
      // console.log(this.listOfTasks);
      this.loading = false;
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      console.warn(this.setOfCheckedId);
    });
  }
  xAxisChange(event: any) {
    if (event == true) {
      this.updateOptions = {
        series: this.dataSrc,
        xAxis: {
          data: this.timeXOrg,
        },
      };
      let start = this.timeXOrg[this.markAreaRange[0]];
      let end = this.timeXOrg[this.markAreaRange[1]];
      this.selectedRangeMsg = `${start} ~ ${end}`;
    } else {
      this.updateOptions = {
        series: this.dataSrc,
        xAxis: {
          data: this.timeX,
        },
      };
      let start = this.timeX[this.markAreaRange[0]];
      let end = this.timeX[this.markAreaRange[1]];
      this.selectedRangeMsg = `${start} ~ ${end}`;
    }
    this.chart.setOption({
      title: {
        text: '选取时间范围: ' + this.selectedRangeMsg,
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // console.log(params);
    let idx = params.pageIndex == 0 ? 1 : params.pageIndex;
    let size = params.pageSize;
    this.loadTaskListFromSrv(idx, size);
  }
  calcDurationTime(start: string, end: string) {
    return Math.floor(((new Date(end).getTime() - new Date(start).getTime()) / (60 * 1000)));
  }
  getStatusInfo(status: number) {
    return status == 0 ? '进行中' : status == 1 ? '已完成' : '已取消';
  }
  // showDeleteComfirmDlg(id:string, desc:string){
  //   this.showDeleteDlg(id,desc);
  // }
  // onTaskDelete(id:string){
  //   if(id && id.length > 0){
  //     this.showChartLoading(true);

  //     setTimeout(() => {
  //       let queryParams = new HttpParams().append("Uid", id);
  //       this.http.get(env.url(env.Api_HistoryTaskDelete), { params: queryParams}).subscribe({
  //         complete: () => { }, // completeHandler
  //         error: (e) => {
  //           console.log(e);
  //           this.showChartLoading(false);
  //           this.dialogMsg = JSON.stringify(e);
  //           this.showMsgDlg()
  //         },    // errorHandler 
  //         next: (res: any) => {
  //           // console.log('onTaskDelete onResponse');
  //           console.log(res);
  //           this.showChartLoading(false);
  //           if(res != null && res != undefined && res.Code == 0){
  //             this.dialogMsg = '删除成功';              
  //           }else{
  //             this.dialogMsg = '删除失败(或该记录已不存在)';
  //           }
  //           this.showMsgDlg();
  //           this.onTasksSearch();
  //         },     // nextHandler
  //       });
  //     }, 500);

  //   }
  // }
  onTaskDelete() {
    if (this.setOfCheckedId != undefined && this.setOfCheckedId.size > 0) {
      this.showChartLoading(true);

      setTimeout(() => {
        let paramsStr = '';
        this.setOfCheckedId.forEach(element => {
          paramsStr = paramsStr + ',"' + element + '"';
        });
        paramsStr = '[' + paramsStr.replace(',', '') + ']';
        console.log(paramsStr);
        // let json = JSON.parse(paramsStr);
        let cookie = this.cookieSrv.get('AppToken');
        console.log('AppToken = ',cookie);
        var myheaders = new HttpHeaders({
          'Content-Type': 'application/json',
          'token':cookie,
        });
        console.warn('myheaders = ',myheaders);
        //
        this.http.post(env.url(env.Api_HistoryTaskDelete), paramsStr, {headers:myheaders}).subscribe({
          complete: () => { }, // completeHandler
          error: (e) => {
            console.log(e);
            this.showChartLoading(false);
            // this.dialogMsg = JSON.stringify(e);
            this.dialogMsg = '删除失败';
            this.showMsgDlg();
          },    // errorHandler 
          next: (res: any) => {
            // console.log('onTaskDelete onResponse');
            console.log(res);
            this.showChartLoading(false);
            if (res != null && res != undefined && res.Code == 0) {
              this.dialogMsg = '删除成功';
            } else {
              this.dialogMsg = '未全部删除';
            }
            this.showMsgDlg();
            this.onTasksSearch();
          },     // nextHandler
        });
      }, 500);

    }
  }
  onTaskDetail(id: string, endTime: string, startTime: string, desc: string) {
    this.message = 'show task detail, id = ' + id;
    this.taskUid = id;
    // let duration = this.calcDurationTime(startTime, endTime);
    // this.initDataSrc(duration * 60);
    // this.initTimeX(duration * 60, endTime);
    this.initDataSrc(this.showLen);
    this.initTimeX(this.showLen, endTime);
    // this.updateChartOptions();
    this.initLegendSelectedStatus();
    this.initDefaultCalcShowList();
    this.showDetailFlg = true;
    this.chartShowFlg = true;
    this.xAxisFromZeroFlg = false;
    //
    this.taskTimeStr = startTime;
    let descStr = desc.replace(/[\n\r]/g, '  ');
    this.taskDesc = descStr;
    //
    setTimeout(() => {
      this.showChartLoading(true);
      let queryParams = new HttpParams().append("Uid", id);
      this.http.get(env.url(env.Api_HistoryTaskDetail), { params: queryParams, observe: 'response', responseType: 'arraybuffer' })
        .subscribe((response: HttpResponse<any>) => {
          try {
            if (response != null && response != undefined) {
              // console.log('response Called');
              // console.log(response);
              const headers: HttpHeaders = response.headers;
              const body: any = response.body;
              let type = headers.get('content-type');
              console.log(type);
              if (type != null && !type.includes('application/json')) {
                let buffer = body as ArrayBuffer;
                var protoBuf = Buffer.from(buffer);
                let protoMsg = this.protocSrc.deserializeMessageBinary(protoBuf);
                let array = protoMsg.array;
                console.log(array);
                // updateFromProtobuf
                if (array != null && array != undefined && array.length == 3) {
                  this.updateFromProtobuf(array);
                  this.updateChartOptions();
                }
              } else {
                // console.log(body);
              }
            }
          } catch (error) {
            console.log(error);
          }
          this.showChartLoading(false);
        });
    }, 500);
  };

  updateFromProtobuf(buf: any) {
    if (buf != null && buf != undefined && buf.length == 3) {
      let maxTmp = this.yMax;
      let startTime = buf[0];
      let timeCnt = buf[1].length;
      let dataArray = buf[2];
      // let totalSize = dataArray.length;
      console.warn(startTime);
      console.warn(timeCnt);
      console.warn(dataArray);
      let channelCnt = this.dataSrc.length;
      for (let chnIdx = 0; chnIdx < channelCnt; chnIdx++) {
        this.dataSrc[chnIdx].data = new Array(timeCnt);
      }
      this.timeX = new Array(timeCnt);
      this.timeXOrg = new Array(timeCnt);
      this.taskStartDt = startTime;
      for (let x = 0; x < timeCnt; x++) {
        let defTimeStamp = buf[1][x];
        let dt = new Date(startTime + buf[1][x]);
        let fmtTime = `${this.add0(dt.getHours())}:${this.add0(dt.getMinutes())}:${this.add0(dt.getSeconds())}`
        this.dTimeArray[x] = defTimeStamp;
        this.timeX[x] = fmtTime;
        this.timeXOrg[x] = this.getFormatTimeStrByxAxisIndex(buf[1][x] / 1000);
        for (let i = 0; i < channelCnt; i++) {
          let tmp = dataArray[x * channelCnt + i] / 10;
          this.dataSrc[i].data[x] = tmp;
          // console.log(`dataSrc[${i}].data[${x}] = ${this.dataSrc[i].data[x]}, dataArray[${x*channelCnt + i}] = ${dataArray[x*channelCnt + i]}`);
          if ((tmp + (10 - tmp % 10)) - maxTmp > 0) {
            maxTmp = maxTmp + 50;
            this.yMax = maxTmp;
          }
        }
      }
    }
  }

  updateChartOptions() {
    this.updateOptions = {
      series: this.dataSrc,
      xAxis: {
        data: this.timeX,
        // axisLabel: {
        //   interval: this.dynInterval,
        // },
      },
      yAxis: {
        max: this.yMax,
      },
    };
  }
  legendSelectedChange(event: any) {
    // console.log(event);
    let size = this.groupCnt * this.channelCnt;
    // let name = event.name;
    let selectedList = event.selected;
    for (let i = 0; i < size; i++) {
      let name = `通道${Math.floor(i /  this.channelCnt) + 1}-${i %  this.channelCnt + 1}`;
      this.legendSelected[i] = selectedList[name];
    }
    this.initDefaultCalcShowList();
    // console.log(this.legendSelected);
  }
  initDefaultCalcShowList() {
    this.calcData = new Array();
    let size = this.groupCnt * this.channelCnt;
    for (let i = 0; i < size; i++) {
      let chnNm = `CH0${Math.floor(i / this.channelCnt) + 1}0${Math.floor(i % this.channelCnt) + 1}`;
      if (this.legendSelected[i]) {
        let chnData: calcData = {
          channelName: chnNm,
          min: '',
          max: '',
          mean: '',
          pp: '',
        }
        this.calcData.push(chnData);
      }
    }
  }
  requestCalcDataByTask() {
    let taskUid = this.taskUid;
    let rngL = Number.parseFloat(this.rangeLeft);
    let rngR = Number.parseFloat(this.rangeRight);
    let canCalc = false;
    for (let x = 0; x < this.legendSelected.length && !canCalc; x++) {
      canCalc = canCalc || this.legendSelected[x];
    }
    console.log('canCalc = ', canCalc);
    if (canCalc) {

      if (this.rangeLeft.length > 0 && this.rangeRight.length > 0
        && rngL != null && rngL != NaN && rngR != null && rngR != NaN) {
        console.log(`rngL = ${this.rangeLeft}, rngR = ${this.rangeRight}`);

        if (taskUid != null && taskUid != undefined && taskUid.length > 0) {
          let sensors: string[] = [];
          let size = this.groupCnt * this.channelCnt;
          let chnCnt = this.channelCnt;
          for (let x = 0; x < size; x++) {
            let tmpStr = `Sensor${Math.floor(x / chnCnt)}${x % chnCnt}`;
            if (this.legendSelected[x]) {
              sensors.push(tmpStr);
            }
          }
          if (sensors.length > 0) {
            //
            this.isCalcTableLoading = true;
            //
            console.log(`rngL = ${Math.floor(rngL * 10)}, rngR = ${Math.floor(rngR * 10)}`);
            let startDt = this.taskStartDt + this.dTimeArray[this.markAreaRange[0] >= 0 ? this.markAreaRange[0] : 0];
            let stopDt = this.taskStartDt + this.dTimeArray[this.markAreaRange[1] >= 0 ? this.markAreaRange[1] : 0];
            var req = new HttpReq_GetCalcResult;
            req.Sensors = sensors;
            req.Uid = taskUid;
            req.RangeL = Math.floor(rngL * 10);
            req.RangeR = Math.floor(rngR * 10);
            req.Start = this.markAreaRange[0] >= 0 ? this.formatTime(new Date(startDt)) : '';
            req.Stop = this.markAreaRange[1] >= 0 ? this.formatTime(new Date(stopDt)) : '';
            console.log(req);
            this.clearCalcData();
            this.http.post(env.url(env.Api_CalcResult), req, httpOptions).subscribe({
              complete: () => { this.isCalcTableLoading = false; }, // completeHandler
              error: (e) => {
                console.log(e);
              },    // errorHandler 
              next: (res: any) => {
                console.log(res);
                if (res != null && res != undefined && res.RtnData != undefined && res.Code == 0) {
                  let data = res.RtnData;
                  this.calcData = new Array();
                  for (let i = 0; i < data.length; i++) {
                    let channelNm = data[i].SensorField;
                    channelNm = channelNm.substring(0, channelNm.length - 2).replace('Sensor', 'CH')
                      .concat('0' + (Number.parseInt(channelNm.substring(channelNm.length - 2, channelNm.length - 1)) + 1))
                      .concat('0' + (Number.parseInt(channelNm.substring(channelNm.length - 1)) + 1));
                    let min = (data[i].Min / 10.0).toFixed(1);
                    let max = (data[i].Max / 10.0).toFixed(1);
                    let mean = (data[i].Mean / 10.0).toFixed(1);
                    let pp = ((data[i].Max - data[i].Min) / 10.0).toFixed(1);
                    let chnData: calcData = {
                      channelName: channelNm,
                      min: min,
                      max: max,
                      mean: mean,
                      pp: pp,
                    }
                    console.log(chnData);
                    this.calcData.push(chnData);
                  }
                }
              },     // nextHandler
            });
          }
        }
      } else {
        console.log(`rngL = ${rngL}, rngR = ${rngR}`);
        this.dialogMsg = '请录入有效计算范围';
        this.showMsgDlg();
      }
    } else {
      console.log(`rngL = ${rngL}, rngR = ${rngR}`);
      this.dialogMsg = '请在图表中, 至少点选一个通道后计算';
      this.showMsgDlg();
    }
  }
  clearCalcData(){
    if(this.calcData != null && this.calcData != undefined
      && this.calcData.length > 0){
        this.calcData.forEach(calc => {
          calc.min = '';
          calc.max = '';
          calc.pp = '';
          calc.mean = '';
        });
    }
  }
  @Input() vRealForce!: number;
  chartDiv: any;
  chart: any;
  onChartInit(event: any) {
    this.chartDiv = event._dom.firstChild;
    this.chart = event;

    setTimeout(() => {
      console.log('onChartInit called');
      this.initBrushSelectListener();
    }, 500);
  }
  @Input() chartOption: echarts.EChartsOption = {
    responsive: true,
    maintainAspectRatio: false,
    showScale: false,
    // maintainAspectRatio: false,
    animation: true,
    animationDuration: 0,
    color: this.colors,
    title: {
      show: false,
    },
    tooltip: {
      trigger: 'axis', //'axis',
      show: true,
    },
    legend: {
      // type: 'scroll',
      align: 'auto',
      itemGap: 32,
      orient: 'horizontal',
      top: 0,
      icon: 'roundRect',
      // data: this.channels,
      show: true,
      selectedMode: true,
      textStyle: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 16,
      },
    },
    brush: {
      toolbox: ['lineX', 'clear'],
      xAxisIndex: 0,
      brushStyle: {
        borderWidth: 1,
        color: 'rgba(120,140,180,0.3)',
        borderColor: 'ivroy'
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "ivroy",  // 图标默认颜色
      },
      emphasis: {
        iconStyle: {
          borderColor: "yellow",  // 图标hover颜色
        },
      },
      top: 40,
      right: 40,
      itemSize: 40, // 设置图标大小      
      showTitle: true,
      feature: {
        brush: {
          title: {
            lineX: '时间范围',
            clear: '清除选择',
          }
        }
      },
    },
    dataZoom: [{
      show: true,
      realtime: true,
      moveHandleSize: 18,//滑动条大小(高度)
    }, {
      show: true,
      type: 'inside', // 'slider',
      realtime: true,
      // zoomOnMouseWheel: true,
    }],
    grid: {
      top: '26%',
      left: '2%',
      right: '5%',
      bottom: '10%',
      containLabel: true
    },
    series: [],
    yAxis: [
      {
        max: this.yMax,
        min: -10,
        name: '温度°C',
        type: 'value',
        nameTextStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white',
        },
      },
    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: this.timeX,
        name: '时间',
        axisLabel: {
          // interval: 8,
          rotate: -60,
          color: 'white',
        },
        nameTextStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white',
        },
      }
    ],
    // animation:true,
    /*
    dataset: {
      source: this.myDataSource,
      type:'line',
    },
  */
  };
  initDataSrc(len: number) {
    this.dataSrc = new Array();
    let maxTmp: number = this.yMax;
    for (let x = 0; x < this.channelCnt; x++) {
      let dataArray = new Array();
      for (let y = 0; y < len; y++) {
        dataArray.push(NaN);
      }
      var data: Line = {
        name: `通道${Math.floor(x / this.channelCnt + 1)}-${x % this.channelCnt + 1}`,
        type: 'line',
        smooth: 0.4,
        symbol: 'circle',// 'none','diamond','pin','roundRect','circle'
        animation: false,
        sampling: 'lttb',
        step: false,
        // stack: 'Total',
        data: dataArray,
        // label: mylabel,
      };
      this.dataSrc.push(data);
    }
    // console.log(this.dataSrc);
  }
  initTimeX(duration: number, endTime: string) {
    this.timeX = [];
    let endDt = new Date(endTime);
    let showLen = duration;
    let startDt = new Date(endDt.getTime() - showLen * 1000);
    for (let i = 0; i < showLen; i++) {
      //console.log((startDt.getTime() + 1000) / 1000);
      var dt = new Date(startDt.setTime(startDt.getTime() + 1000));
      var timestamp = `${this.add0(dt.getHours())}:${this.add0(dt.getMinutes())}:${this.add0(dt.getSeconds())}`;
      this.timeX.push(timestamp);
    }
    // console.log(this.timeX);
  }
  initLegendSelectedStatus() {
    this.legendSelected = [];    
    let size = this.groupCnt * this.channelCnt;
    for (let i = 0; i < size; i++) {
      this.legendSelected.push(false);
    }

    this.legendSelectedJson = '';
    // console.log('init chart selected on Called');
    let tmpSelected = '{';
    for (let i = 0; i < size; i++) {
      let name = `通道${Math.floor(i / this.channelCnt) + 1}-${i % this.channelCnt + 1}`;
      let value = `"${name}":${this.legendSelected[i]}`;
      tmpSelected = tmpSelected.concat(value) + ',';
    }
    tmpSelected = tmpSelected.substring(0, tmpSelected.length - 1);
    tmpSelected = tmpSelected.concat('}');
    // console.log(tmpSelected);
    let json = JSON.parse(tmpSelected);
    console.log(JSON.stringify(json));

    this.updateOptions = {
      series: this.dataSrc,
      xAxis: {
        data: this.timeX,
      },
      yAxis: {
        max: this.yMax,
      },
      legend: {
        selected: json,
      }
    };
  }
  initBrushSelectListener() {
    var that = this;
    that.chart.on('brushSelected', function (params: any) {
      var brushed = [];
      // console.warn(params.batch[0]);
      if (params.batch[0].areas.length > 0) {
        console.warn(params.batch[0].areas[0].coordRange);
        that.markAreaRange[0] = params.batch[0].areas[0].coordRange[0];
        that.markAreaRange[1] = params.batch[0].areas[0].coordRange[1];
        if (that.xAxisFromZeroFlg) {
          let start = that.timeXOrg[that.markAreaRange[0]];
          let end = that.timeXOrg[that.markAreaRange[1]];
          that.selectedRangeMsg = `${start} ~ ${end}`;
        } else {
          let start = that.timeX[that.markAreaRange[0]];
          let end = that.timeX[that.markAreaRange[1]];
          that.selectedRangeMsg = `${start} ~ ${end}`;
        }
        // for (var i = 0; i < that.markAreaRange.length; i++) {
        //   let valIdx = that.markAreaRange[i];
        //   let val = that.timeX[valIdx];
        //   brushed.push((i == 0 ? '[起始]: ' : '[结束]: ') + val);
        // }
        that.chart.setOption({
          title: {
            show: true,
            text: '选取时间范围: ' + that.selectedRangeMsg,
            top: 52,
            right: 180,
            width: 100,
            textStyle: {
              fontSize: 18,
              color: 'yellow'
            }
          }
        });
      }
    });
    that.chart.on('brush', function (params: any) {
      console.warn(params);
      if (params.type == 'brush' && params.command == 'clear') {
        that.chart.setOption({
          title: {
            show: false,
            text: '',
          },
        });
        that.markAreaRange = [-1, -1];
      }
    });
  }
  getMarkArea() {
    console.warn(this.timeX[this.markAreaRange[0]]);
    console.warn(this.timeX[this.markAreaRange[1]]);
    var markArea = {
      silent: true,
      itemStyle: {
        color: 'rgba(254,249,231, 0.7)',
        opacity: 0.3,
      },
      data: [
        [
          {
            name: ' 运算范围 ',
            label: {
              show: true,
              color: 'ivroy',
              fontSize: 16,
            },
            xAxis: this.timeX[this.markAreaRange[0] + 5],
          },
          {
            xAxis: this.timeX[this.markAreaRange[1]],
          }
        ],
      ],
    };
    return markArea;
  };

  // onCurrentPageDataChange(listOfCurrentPageData: readonly Task[]): void {
  //   this.listOfCurrentPageData = listOfCurrentPageData;
  // }
  updateCheckedSet(uid: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(uid);
    } else {
      this.setOfCheckedId.delete(uid);
    }
  }
  refreshCheckedStatus(): void {
    if (this.listOfTasks.length > 0) {
      this.allSelectedInPage = this.listOfTasks.every(({ Uid }) => this.setOfCheckedId.has(Uid));
      this.chkBoxIndeterminate = this.listOfTasks.some(({ Uid }) => this.setOfCheckedId.has(Uid)) && !this.allSelectedInPage;
    } else {
      this.allSelectedInPage = false;
      this.chkBoxIndeterminate = false;
    }
  }
  onItemChecked(uid: string, checked: boolean): void {
    this.updateCheckedSet(uid, checked);
    this.refreshCheckedStatus();
    console.warn('onItemChecked');
    console.warn(this.setOfCheckedId);
  }
  onAllChecked(event: any) {
    this.setOfCheckedId.clear();
    if (event == true) {
      this.listOfTasks.forEach(element => {
        this.setOfCheckedId.add(element.Uid);
      });
    }
    this.refreshCheckedStatus();
    console.warn('onAllChecked');
    console.warn(this.setOfCheckedId);
  }
  deleteSelectedTasks() {
    if (this.setOfCheckedId != undefined && this.setOfCheckedId.size > 0) {
      let cookie = this.cookieSrv.get('AppToken');
      if(cookie != null && cookie != undefined && cookie.length > 0){
        this.showDeleteDlg();
      }else{
        this.dialogMsg = '非登录状态，请进行登录';
        this.showMsgDlg();
      }
    } else {
      this.dialogMsg = '未勾选有效任务';
      this.showMsgDlg();
    }
  }
  close(): void {
    this.showDetailFlg = false;
    this.markAreaRange = [-1, -1];
  }
  handleOk(): void {
    // console.log('Button ok clicked!');
    this.showMsgDialog = false;
  }
  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.showMsgDialog = false;
  }
  showMsgDlg() {
    this.showMsgDialog = true;
  }
  showDeleteDlg() {
    // this.dialogMsg = `是否确认删除该任务,<br/> 任务ID: ${id},<br/> 描述：${desc} `;
    this.showDeleteConfirmFlg = true;
  }
  // showDeleteDlg(id:string,desc:string) {
  //   this.currentDelUid = id;
  //   this.deleteConfirmInfo[0] = id;
  //   this.deleteConfirmInfo[1] = desc;
  //   // this.dialogMsg = `是否确认删除该任务,<br/> 任务ID: ${id},<br/> 描述：${desc} `;
  //   this.showDeleteConfirmFlg = true;
  // }  
  deleteCancel(): void {
    // console.log('Button cancel clicked!');
    this.currentDelUid = '';
    this.showDeleteConfirmFlg = false;
  }
  deleteOk(): void {
    // console.log('Button ok clicked!');
    this.showDeleteConfirmFlg = false;
    // this.onTaskDelete(this.currentDelUid);
    this.onTaskDelete();
  }
  formatTime = (date: Date): string => {
    let time = '';
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
    return time;
  };
  add0(data: number) {
    return data < 10 ? '0' + data : data;
  };
  // initTestData() {
  //   this.listOfTasks = new Array(100).fill(0).map((_, index) => ({
  //     Uid: `UID${index < 100 ? (index < 10 ? '00' + index : '0' + index) : index}`,
  //     ITime: this.formatTime(new Date(new Date().getTime() + index * 1000)),
  //     EndTime: this.formatTime(new Date(new Date().getTime() + 60 * 60 * 1000 + index * 60 * 1000)),
  //     // Duration: (60 + index).toFixed(),
  //     Status: index % 2,
  //     Desc: '描述信息',
  //   }));
  // };
  getStartTime(start: string) {
    return start.split(' ')[0] + ' 00:00:00'
  };
  getEndTime(start: string) {
    return start.split(' ')[0] + ' 23:59:59'
  };
  showChartLoading(show: boolean) {
    if (this.chart != null && this.chart != undefined) {
      if (show) {
        this.chart.showLoading({
          text: '加载中...',
          textColor: 'darkgray',
          color: 'darkgray',
          maskColor: 'rgba(97, 97, 97, 0.1)',
          fontSize: 24,
        });
      } else {
        this.chart.hideLoading();
      }
    }
  };
  switchStyle(flag: boolean) {
    var style = {
      'width': '60%',
    };
    if (flag) {
      style = {
        'width': '100%',
      };
    }
    return style;
  };
  getFormatTimeStrByxAxisIndex(idx: number) {
    let hours = 0;
    let mins = 0;
    let snds = 0;
    snds = idx % 60;
    mins = ((idx - snds) / 60) % 60;
    hours = (((idx - snds) / 60) - mins) / 60;
    let minStr = this.add0(mins);
    let sndStr = this.add0(Math.floor(snds));
    return `${hours}:${minStr}:${sndStr}`;
  }

}

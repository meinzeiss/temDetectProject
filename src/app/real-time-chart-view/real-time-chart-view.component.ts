import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, } from '@angular/core';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { DataStorageService } from '../data-storage.service';
import { WebSocketService } from '../web-socket.service';
import * as env from '@environment';
import { ProtobufService } from '../protobuf.service';
import { HeartCheckService } from '../heart-check-service';
import { Buffer } from 'buffer/';
import { LogService } from '../log.service';
// interface Label {
//   show: boolean,
//   position: string,
//   textStyle: object,
// };
// for list
export class HttpReq_GetCalcResult {
  Sensors!: string[]
  Uid!: string
  RangeL!: number
  RangeR!: number
  Start!: string
  Stop!: string
}
interface Line {
  id: number;
  name: string;
  type: string;
  // stack: string;
  data: number[];
  animation: boolean;
  smooth: number;
  symbol: string;
  sampling: string;
  step: boolean;
  markArea: any;
  // label: Label;
};
export interface checkBoxInfo {
  label: string,
  value: string,
  checked: boolean,
}
export interface group {
  groupIdx: number,
  allChecked: boolean;
  indeterminate: boolean;
  channels: channel[],
  checkOptionsOne: checkBoxInfo[];
}
export interface channel {
  groupIdx: number,
  name: string,
  temperature: number,
  checked: boolean,
};
export interface calcData {
  channelName: string,
  min: string,
  max: string,
  pp: string,
  mean: string,
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials':'true',

    // Authorization: 'my-auth-token'
  })
};

@Component({
  selector: 'app-real-time-chart-view',
  templateUrl: './real-time-chart-view.component.html',
  styleUrls: ['./real-time-chart-view.component.css']
})

export class RealTimeChartViewComponent implements OnInit {
  @Input() PosIdx!: number;

  colors: string[] = ['#e6194b', '#3cb44b', '#4363db', '#ffe119', '#f032e6',
    '#800000', '#9a8324', '#469990', '#000075', '#f58231',
    '#fabed4', '#fffac8', '#aaffc3', '#dcbeff', '#4b0082']
  selectedChannels: any = {
    'Path1-1': false, 'Path1-2': false, 'Path1-3': false, 'Path1-4': false, 'Path1-5': false,
    'Path2-1': false, 'Path2-2': false, 'Path2-3': false, 'Path2-4': false, 'Path2-5': false,
    'Path3-1': false, 'Path3-2': false, 'Path3-3': false, 'Path3-4': false, 'Path3-5': false,
  }
  cmptName: string = 'RealTimeChartViewComponent';
  logSrv: LogService;
  showDialog: boolean = false;
  showCalcResultFlg: boolean = false;
  placement: NzDrawerPlacement = 'right';

  realDtSubscriptionWs: any;
  realDtSubscriptionHeart: any;
  http: HttpClient;
  webSock: WebSocketService;
  heart: HeartCheckService;
  dataStorage: DataStorageService;
  protoc: ProtobufService;
  legendData: string[] = [];
  hasTask: boolean = false;
  yMax = 50;
  dataSrc: any;
  groups: group[] = [];
  lastGroups: group[] = [];
  showLen: number = 600;
  rangs: number[] = [10, 20, 30, 40, 50, 60];
  rangs2: number[] = [80, 70, 60, 50, 40, 30];
  timeX: string[] = [];
  interTime: any;
  calcData: calcData[] = [];
  isCalcTableLoading: boolean = false;
  updateOptions: any;
  isUpdatingBuf: boolean = false;
  dialogMsg: string = '';
  rangeLeft: any = '';
  rangeRight: any = '';
  currentUid: string = '';
  Number: any;
  // myDataSource: number[] = [];  //
  limitMax:number = 50;
  limitMin:number = -10;
  currentMax:number = 50;
  currentMin:number = -10;

  constructor(private storage: DataStorageService, private ws: WebSocketService, logger: LogService,
    heart: HeartCheckService, http: HttpClient, protoSrc: ProtobufService) {
    this.http = http;
    this.webSock = ws;
    this.heart = heart;
    this.dataStorage = storage;
    this.protoc = protoSrc;
    this.logSrv = logger;
  }

  ngOnInit(): void {
    // console.log('ngOnInit Called');

    this.initChannelList();
    this.initDataSrc();
    this.initTimeX();
    this.initCacheSelectdStatus();

    this.interTime = setInterval(() => {
      let options = this.chart.getOption()
      // console.log('setInterval, options =',options);
      if (this.chart != null && this.chart != undefined
          && options != null && options !=undefined) {
        options.series = this.dataSrc;
        options.xAxis[0].data = this.timeX;
        this.chart.setOption(options,{
          replaceMerge: ['xAxis','series']
        });
      }
      this.updateOptions = {
        // series: this.dataSrc,
        // xAxis: {
        //   data: this.timeX
        // },
        yAxis: {
          max: this.limitMax,
          min: this.limitMin,
        },
        legend: {
          data: this.legendData,
          selected: this.selectedChannels
        }
      };
    }, 1000);
    this.realDtSubscriptionHeart = this.heart.getSubject().subscribe(this.heartCallBack.bind(this));
    this.realDtSubscriptionWs = this.webSock.getSubject().subscribe(this.wsCallBack.bind(this));
  }

  ngOnDestroy(): void {
    this.cacheSelectedStatus();
    this.realDtSubscriptionHeart.unsubscribe();
    this.realDtSubscriptionWs.unsubscribe();
    clearInterval(this.interTime);
  }

  heartCallBack(res: any) {
    if (res != undefined && res.RtnData != undefined && res.RtnData.RunningTask != null && res.RtnData.RunningTask != undefined
      && res.RtnData.RunningTask.Uid != undefined && res.RtnData.RunningTask.Uid.length > 0) {
      this.hasTask = true;
      this.currentUid = res.RtnData.RunningTask.Uid;
    } else {
      this.hasTask = false;
      this.currentUid = '';
    }
    // console.log('hasTask = ', this.hasTask);
  }

  wsCallBack(res: any) {
    if (!this.isUpdatingBuf) {
      // console.log('wsCallBack onCalled');
      // let maxTmp = this.yMax;
      if (res != undefined && res.Data != undefined && res.Data.length == 3) {
        let channelCnt = this.dataSrc.length;
        let chartShowLen = this.dataSrc[0].data.length;
        let illegalflg = res.Illegalflg;
        let time = res.TimeFlg;
        let lastDt = new Date(time);
        let timeStamp = `${this.add0(lastDt.getHours())}:${this.add0(lastDt.getMinutes())}:${this.add0(lastDt.getSeconds())}`;
        this.timeX.shift();
        this.timeX.push(timeStamp);
        this.currentMax = 50;
        this.currentMin = -10;
        for (let x = 0; x < res.Data.length; x++) {
          let chnCnt = res.Data[x].length;
          for (let y = 0; y < res.Data[x].length; y++) {

            let tmp = res.Data[x][y] / 10;
            // }
            // if(x == 0 && y == 0){
            //   tmp = Number.parseInt((-100000*(1 + Math.random())).toFixed());
            // }
            // if(x == 2 && y == 1){
            //   tmp = Number.parseInt((900*(1 + Math.random())).toFixed());
            // }
            // if(x == 1 && y == 1){
            //   tmp = Number.parseInt((-50*(1 + Math.random())).toFixed());
            // }
            console.log('channel.tmp = ',tmp);
            //
            this.groups[x].channels[y].temperature = illegalflg ? NaN : tmp;;
            // let tmpStr = this.addBlankFront(tmp);
            this.groups[x].checkOptionsOne[y].label = `Path ${x + 1}-${y + 1} ${tmp} °C`;
            this.groups[x].checkOptionsOne[y].value = `Path ${x + 1}-${y + 1}`;
            this.dataSrc[x * 5 + y].data.shift();
            this.dataSrc[x * 5 + y].data.push(tmp);
            // if ((tmp + (10 - tmp % 10)) - maxTmp > 0) {
            //   maxTmp = maxTmp + 50;
            //   this.yMax = maxTmp;
            if (this.groups[x].checkOptionsOne[y].label.length > 0) {
              let dataSrcStr = this.groups[x].checkOptionsOne[y].label;
              this.logSrv.info(this.cmptName, `WebSocket: ${dataSrcStr}`);
            }
            let checked = this.groups[x].channels[y].checked;
            if (checked){
              let channelMax = 0;
              let channelMin = 0;
              this.dataSrc[x * chnCnt + y].data.forEach((item: number) => channelMax = item > channelMax && item != NaN ? item : channelMax);
              this.dataSrc[x * chnCnt + y].data.forEach((item: number) => channelMin = item < channelMin && item != NaN ? item : channelMin)
              // console.log('channelMax',channelMax);
              // console.log('channelMin',channelMin);
              if(channelMax +  (Math.round(channelMax*0.2)/10)*10 > this.currentMax){
                this.currentMax = channelMax +  (Math.round(channelMax*0.2)/10)*10;
                // console.log('channelMax.Up = ',channelMax + (Math.round(channelMax*0.2)/10)*10);
              }else if(channelMin - (Math.round(channelMin*0.2)/10)*10< this.currentMin) {
                this.currentMin = channelMin - (Math.round(channelMin*0.2)/10)*10;
                // console.log('channelMin.Down = ',channelMin - (Math.round(channelMin*0.2)/10)*10);
              }
            }
          }
        }
        this.limitMax = (this.currentMax <= 50 ? 50 : this.currentMax);
        this.limitMin = (this.currentMin >= -10 ? -10 : this.currentMin);
        // console.log('limitMax',this.limitMax);
        // console.log('limitMin',this.limitMin);
      }
    }
  }

  updateFromDataStorage() {
    // console.log('updateFromDataStorage Called');
    let maxTmp = this.yMax;
    var dts = this.dataStorage.getQueuePt().toArray()
    // console.log(dts);
    if (dts != undefined && dts.length > 0) {
      let storageLen = dts.length;
      let chartShowLen = this.showLen;
      let showIdx = chartShowLen - 1;
      for (let i = storageLen - 1; i >= 0 && showIdx >= 0; i--) {
        let groups = dts[i].Data;
        let timeFlg = dts[i].TimeFlg;
        let dt = new Date(timeFlg);
        let fmtTime = `${this.add0(dt.getHours())}:${this.add0(dt.getMinutes())}:${this.add0(dt.getSeconds())}`;
        this.timeX[showIdx] = fmtTime;
        for (let x = 0; x < groups.length; x++) {
          let group = groups[x];
          for (let y = 0; y < group.length; y++) {

            let tmp = group[y] / 10;

            this.dataSrc[x * 5 + y].data[showIdx] = tmp;
            if ((tmp + (10 - tmp % 10)) - maxTmp > 0) {
              maxTmp = maxTmp + 50;
              this.yMax = maxTmp;
            }
          }
        }
        showIdx--;
      }
    }
  }
  updateFromProtobuf(buf: any) {
    if (buf != null && buf != undefined && buf.length == 3) {
      let maxTmp = this.yMax;
      let startTime = buf[0];
      let timeCnt = buf[1].length;
      let dataArray = buf[2];
      let chartShowLen = this.showLen;
      let showIdx = chartShowLen - 1;
      let channelCnt = this.dataSrc.length;
      for (let x = timeCnt - 1; x >= 0 && showIdx >= 0; x--) {
        let dt = new Date(startTime + buf[1][x]);
        let fmtTime = `${this.add0(dt.getHours())}:${this.add0(dt.getMinutes())}:${this.add0(dt.getSeconds())}`
        this.timeX[showIdx] = fmtTime;
        for (let i = channelCnt - 1; i >= 0; i--) {

          let tmp = dataArray[x * channelCnt + i] / 10;

          this.dataSrc[i].data[showIdx] = tmp;
          if ((tmp + (10 - tmp % 10)) - maxTmp > 0) {
            maxTmp = maxTmp + 50;
            this.yMax = maxTmp;
          }
        }
        showIdx--;
      }
    }
  }
  /**
   * request data in protobuf
   */
  requestTaskDataInLastMins() {
    // console.log('requestTaskDataInLastMins Called');
    let mins: number = 10;
    let queryParams = new HttpParams().append("LastMins", mins);
    this.isUpdatingBuf = true;
    this.showChartLoading(true);
    this.http.get(env.url(env.Api_LastTaskDataInMins), { params: queryParams, observe: 'response', responseType: 'arraybuffer' })
      .subscribe((response: HttpResponse<any>) => {
        let loadStorage: boolean = true;
        try {
          if (response != null && response != undefined) {
            // console.log('response Called');
            // console.log(response);
            const headers: HttpHeaders = response.headers;
            const body: any = response.body;
            let type = headers.get('content-type');
            // console.log(type);
            if (type != null && !type.includes('application/json')) {
              let buffer = body as ArrayBuffer;
              var protoBuf = Buffer.from(buffer);
              let protoMsg = this.protoc.deserializeMessageBinary(protoBuf);
              let array = protoMsg.array;
              // console.log(array);
              // updateFromProtobuf
              if (array != null && array != undefined && array.length == 3) {
                this.updateFromProtobuf(array);
                loadStorage = false;
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
        if (loadStorage) {
          this.updateFromDataStorage();
        }
        this.isUpdatingBuf = false;
        this.showChartLoading(false);
      });
  }
  showChartLoading(show: boolean) {
    if (this.chart != null && this.chart != undefined) {
      if (show) {
        this.chart.showLoading({
          text: 'Loading...',
          textColor: 'darkgray',
          color: 'darkgray',
          maskColor: 'rgba(97, 97, 97, 0.1)',
          fontSize: 26,
        });
      } else {
        this.chart.hideLoading();
      }
    }
  }
  stopTask() {
    // console.log('StopTask Called');
    this.http.get(env.url(env.Api_StopTask)).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => {
        console.log(e);
      },    // errorHandler
      next: (res: any) => {
        // console.log('stopTaskCallBack onResponse');
        // console.log(res);
        this.dialogMsg = 'Current Task Ended';
        this.showDialog = true;
      },     // nextHandler
    });
  }
  initDefaultCalcShowList() {
    this.calcData = new Array();
    for (let x = 0; x < this.groups.length; x++) {
      for (let y = 0; y < this.groups[x].channels.length; y++) {
        let chnNm = `CH0${x + 1}0${y + 1}`;
        if (this.groups[x].channels[y].checked) {
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
  }
  requestCalcDataByTask() {
    let taskUid = this.currentUid;
    let rngL = Number.parseFloat(this.rangeLeft);
    let rngR = Number.parseFloat(this.rangeRight);
    let canCalc = false;
    for (let i = 0; i < 15; i++) {
      let name = `Path ${Math.floor(i / 5) + 1}-${i % 5 + 1}`;
      canCalc = canCalc || this.selectedChannels[name];
    }
    if (canCalc) {
      if (this.rangeLeft.length > 0 && this.rangeRight.length > 0
        && rngL != null && rngL != NaN && rngR != null && rngR != NaN) {
        console.log(`rngL = ${this.rangeLeft}, rngR = ${this.rangeRight}`);
        if (taskUid != null && taskUid != undefined && taskUid.length > 0) {
          let sensors: string[] = [];
          for (let x = 0; x < this.groups.length; x++) {
            for (let y = 0; y < this.groups[x].channels.length; y++) {
              let tmpStr = `Sensor${x}${y}`;
              if (this.groups[x].channels[y].checked) {
                sensors.push(tmpStr);
              }
            }
          }
          if (sensors.length > 0) {
            this.isCalcTableLoading = true;
            console.log(`rngL = ${Math.floor(rngL * 10)}, rngR = ${Math.floor(rngR * 10)}`);

            var req = new HttpReq_GetCalcResult;
            req.Sensors = sensors;
            req.Uid = taskUid;
            req.RangeL = Math.floor(rngL * 10);
            req.RangeR = Math.floor(rngR * 10);
            console.log(req);
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
        this.subShowDlg();
      }
    } else {
      console.log(`rngL = ${rngL}, rngR = ${rngR}`);
      this.dialogMsg = '请在图表中至少勾选一条Path 后计算';
      this.subShowDlg();
    }
  }

  @Input() vRealForce!: number;
  chartDiv: any;
  chart: any;
  onChartInit(event: any) {
    this.chartDiv = event._dom.firstChild;
    this.chart = event;
    var that = this;
    setTimeout(() => {
      console.log('onChartInit called');
      this.requestTaskDataInLastMins();
      // this.initEChartsClickListener();
    }, 500);
  }
  initChannelList() {
    let dataArray = new Array();

    for (let x = 0; x < 3; x++) {
      let channelArr: channel[] = new Array();
      let checkBoxs: checkBoxInfo[] = new Array();
      let group: group = {
        groupIdx: (x + 1),
        allChecked: false,
        indeterminate: false,
        channels: channelArr,
        checkOptionsOne: checkBoxs,
      }
      for (let y = 0; y < 5; y++) {
        let channel: channel = {
          groupIdx: (x + 1),
          name: `${[y + 1]}`,
          temperature: NaN,
          checked: false,
        };
        channelArr.push(channel);
      }
      for (let z = 0; z < 5; z++) {
        let chkbox: checkBoxInfo = {
          label: `Path ${x + 1}-${z + 1} ${NaN} °C`,
          value: `Path ${x + 1}-${z + 1}`,
          checked: false,
        };
        checkBoxs.push(chkbox);
      }
      this.groups.push(group);
    }
    // console.log(this.groups);
  }

  initTimeX() {
    this.timeX = [];
    let startDt = new Date();
    startDt.setTime(startDt.getTime() - this.showLen * 1000)
    for (let i = 0; i < this.showLen; i++) {
      //console.log((startDt.getTime() + 1000) / 1000);
      var dt = new Date(startDt.setTime(startDt.getTime() + 1000));
      var timestamp = `${this.add0(dt.getHours())}:${this.add0(dt.getMinutes())}:${this.add0(dt.getSeconds())}`;
      this.timeX.push(timestamp);
    }
    // console.log(this.timeX);
  }

  initDataSrc() {
    this.dataSrc = new Array();
    this.legendData = new Array();
    let maxTmp: number = this.yMax;
    for (let x = 0; x < 15; x++) {
      let dataArray = new Array();
      for (let y = 0; y < this.showLen; y++) {
        dataArray.push(NaN);
      }
      var data: Line = {
        id: x,
        name: `Path ${Math.floor(x / 5 + 1)}-${x % 5 + 1}`,
        type: 'line',
        smooth: 0.4,
        symbol: 'none',
        animation: false,
        sampling: 'lttb',
        step: false,
        // showSymbol: false,
        // stack: 'Total',
        data: dataArray,
        markArea: '',
      };
      this.dataSrc.push(data);
      this.legendData.push(data.name);
      // console.log(data);
    }
    // console.log(this.dataSrc);
    // console.log(this.legendData);
  }
  initCacheSelectdStatus() {
    console.log('initCacheSelectdStatus');
    // console.log(this.groups);
    let selectedStr: string = this.storage.getCacheRealChartSelectedResult();
    if (selectedStr != null && selectedStr != undefined && selectedStr.length > 0) {
      let size = this.groups[0].channels.length;
      let statusArray = selectedStr.split(',');
      // console.log(statusArray);
      for (let x = 0; x < this.groups.length; x++) {
        let isAllChked = true;
        let indeterminate = false;
        for (let y = 0; y < size; y++) {
          let name = `Path ${x + 1}-${y + 1}`;
          let currentChecked = statusArray[x * size + y] == 'true';
          this.groups[x].channels[y].checked = currentChecked;
          this.groups[x].checkOptionsOne[y].checked = currentChecked;
          this.selectedChannels[name] = currentChecked;
          isAllChked = isAllChked && currentChecked;
          indeterminate = indeterminate || currentChecked;
        }
        this.groups[x].allChecked = isAllChked;
        this.groups[x].indeterminate = indeterminate && this.groups[x].allChecked == false;
      }
    } else {
      console.log('Cache Selected Result is Null');
    }
    // console.log(this.groups);
  }
  cacheSelectedStatus() {
    if (this.groups != null && this.groups != undefined && this.groups.length > 0) {
      this.storage.cacheRealChartSelectedResult(this.groups);
    }
  }
  add0(data: number) {
    return data < 10 ? '0' + data : data;
  }

  updateAllChecked(grpIdx: number, chked: boolean): void {
    // console.log(`grpIdx[${grpIdx}] on clicked`);
    this.groups[grpIdx].indeterminate = false;
    if (this.groups[grpIdx].allChecked) {
      this.groups[grpIdx].checkOptionsOne = this.groups[grpIdx].checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.groups[grpIdx].checkOptionsOne = this.groups[grpIdx].checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }
    for (let i = 0; i < this.groups[grpIdx].channels.length; i++) {
      let channelNm = this.groups[grpIdx].checkOptionsOne[i].value;
      this.groups[grpIdx].channels[i].checked = chked;
      this.selectedChannels[channelNm] = chked;
    }
  }
  updateSingleChecked(channel: channel, chkFlg: boolean): void {
    // console.log(channel);
    let grpIdx = channel.groupIdx - 1;
    let channelCnt = this.groups[0].channels.length;
    let chnNm = `Path ${channel.groupIdx}-${channel.name}`;
    // console.log(chnNm);
    for (let i = 0; i < channelCnt; i++) {
      let labelNm = this.groups[grpIdx].checkOptionsOne[i].value;
      if (labelNm == chnNm) {
        // console.log(labelNm);
        this.groups[grpIdx].channels[i].checked = chkFlg;
        this.groups[grpIdx].checkOptionsOne[i].checked = chkFlg;
        this.selectedChannels[labelNm] = chkFlg;
        break;
      }
    }
    if (this.groups[grpIdx].checkOptionsOne.every(item => !item.checked)) {
      this.groups[grpIdx].allChecked = false;
      this.groups[grpIdx].indeterminate = false;
    } else if (this.groups[grpIdx].checkOptionsOne.every(item => item.checked)) {
      this.groups[grpIdx].allChecked = true;
      this.groups[grpIdx].indeterminate = false;
    } else {
      this.groups[grpIdx].indeterminate = true;
    }
  }

  @Input() chartOption: echarts.EChartsOption = {
    responsive: true,
    maintainAspectRatio: false,
    // showScale: false,
    // maintainAspectRatio: false,
    color: this.colors,
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    tooltip: {
      trigger: 'axis', //'axis',
      show: true,
    },
    legend: {
      // type: 'scroll',
      orient: 'horizontal',
      align: 'auto',
      itemGap: 20,
      top: 0,
      icon: 'roundRect',
      // data: this.channels,
      show: true,
      selectedMode: false,
      itemWidth: 24,
      itemHeight: 16,
      textStyle: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 16,
      },
      // tooltip:{},
      selected: this.selectedChannels,
    },
    dataZoom: [{
      show: true,
      realtime: true,
      moveHandleSize: 20,//滑动条大小(高度)
    }, {
      show: true,
      type: 'inside', // 'slider',
      realtime: true,
      // zoomOnMouseWheel: true,
    }],
    grid: {
      top: '15%',
      left: '5%',
      right: '5%',
      bottom: '8%',
      containLabel: true,
    },
    series: [],
    yAxis: [
      {
        max: this.yMax,
        min: -10,
        name: 'Temp °C',
        type: 'value',
        nameTextStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white',
        },
        axisLabel: {
          color: 'white',
          fontSize: 16,
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
        // triggerEvent:true,
        // axisPointer: {
        //   value: this.timeX[this.timeX.length - 2],
        //   snap: true,
        //   lineStyle: {
        //     color: 'ivroy',
        //     width: 2
        //   },
        //   label: {
        //     show: true,
        //     formatter: function (params) {
        //       return JSON.stringify(params.value);
        //     },
        //     fontSize:'0.6rem',
        //     backgroundColor: 'ivroy',
        //     color:'black',
        //   },
        //   handle: {
        //     show: true,
        //     color: 'ivroy'
        //   }
        // },
      }
    ],
    // visualMap: {
    //   type: 'piecewise',
    //   show: false,
    //   dimension: 0,
    //   pieces: [
    //     {
    //       gt: 10,
    //       lt: 50,
    //       color: 'rgba(0, 0, 180, 0.4)'
    //     },
    //     {
    //       gt: 50,
    //       lt: 150,
    //       color: 'rgba(0, 0, 180, 0.4)'
    //     }
    //   ]
    // },

    // textStyle: {
    //   color: '#a9a9a9',
    // },
    //animation:false,
    /*
    dataset: {
      source: this.myDataSource,
      type:'line',
    },
*/
  };
  close(): void {
    this.showCalcResultFlg = false;
  }
  closeDrawerView() {
    this.showCalcResultFlg = false;
  }
  showCalcResult(): void {
    this.initDefaultCalcShowList();
    this.showCalcResultFlg = true;
  }
  onTaskView(id: string) {
    this.subShowDlg();
  };
  onTaskDownload(id: string) {
    this.subShowDlg();
  };
  subShowDlg() {
    this.showDialog = true;
  }
  handleOk(): void {
    this.showDialog = false;
  }
  handleCancel(): void {
    this.showDialog = false;
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
  // initEChartsClickListener(){
  //   console.log('initEChartsClickListener called');
  //   var that = this;
  //   that.markAreaRange = [];
  //   this.chart.on('click', function (params: any) {
  //     console.warn('EChart on clicked !!!');
  //     console.warn('params.event.type: ',params.event.type);
  //     console.warn('params.componentType: ',params.componentType);
  //     console.warn('params.dataIndex: ',params.dataIndex);
  //     console.warn('params.value: ',params.value);
  //     let idx = params.dataIndex;
  //     if('xAxis' == params.componentType && params.dataIndex >= 0){
  //       if(that.markAreaRange.length == 0){
  //         that.markAreaRange[0] = idx;
  //       }else if(that.markAreaRange.length == 1){
  //         let bigger = that.markAreaRange[0];
  //         that.markAreaRange[0] = that.markAreaRange[0] >= idx ? idx : that.markAreaRange[0];
  //         that.markAreaRange[1] = bigger == that.markAreaRange[0] ? idx : bigger;
  //       }else if(that.markAreaRange.length == 2){
  //         let middle:number = (that.markAreaRange[1] - that.markAreaRange[0])/2 + that.markAreaRange[0];
  //         that.markAreaRange[0] = idx < that.markAreaRange[0] ? idx : (idx < middle ? idx : that.markAreaRange[0]);
  //         that.markAreaRange[1] = idx > that.markAreaRange[1] ? idx : (idx > middle ? idx : that.markAreaRange[1]);
  //       }
  //     }
  //     console.warn(that.markAreaRange);
  //     if(that.markAreaRange.length == 2)   {
  //       let mrkArea = that.getMarkArea();
  //       console.warn(mrkArea);
  //       that.dataSrc[0].markArea = mrkArea;
  //       console.warn(that.dataSrc[0].data);
  //       that.updateOptions = {
  //         series: that.dataSrc,
  //       };
  //     }
  //   });
  //   this.chart.on('dblclick', function (params: any) {
  //     console.warn('EChart on clicked !!!');
  //     console.warn('params.event.type: ',params.event.type);
  //     console.warn('params.componentType: ',params.componentType);
  //     console.warn('params.dataIndex: ',params.dataIndex);
  //     console.warn('params.value: ',params.value);
  //     that.markAreaRange = [];
  //     that.dataSrc[0].markArea = '';
  //   });
  // }
}

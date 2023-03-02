import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { DataStorageService } from '../data-storage.service';
import { WebSocketService } from '../web-socket.service';
// import ResizeObserver from 'resize-observer-polyfill';


class HttpReq_Order {
  CmdCode: number = 0
  Param1: number = 0
  Param2: number = 0
  Param3: number = 0
  Param4: number = 0
  Param5: number = 0
  Param6: number = 0
}


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: 'my-auth-token'
  })
};

@Component({
  selector: 'app-cylinder-info',
  templateUrl: './cylinder-info.component.html',
  styleUrls: ['./cylinder-info.component.css']
})
export class CylinderInfoComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() PosIdx!: number;

  realDtSubscription: any;
  webSock: WebSocketService;
  dataStorage: DataStorageService;

  xAxisData: number[] = [];
  constructor(private ngZone: NgZone, storage: DataStorageService, ws: WebSocketService, private elRef: ElementRef, private renderer: Renderer2, private http: HttpClient) {
    this.webSock = ws;
    this.dataStorage = storage;

    for (let i = 0; i < 30; i++) {
      this.xAxisData.push(i);
    }

  }

  ngOnDestroy(): void {
    this.realDtSubscription.unsubscribe();
    clearInterval(this.interTime);
  }

  interTime: any
  ngOnInit(): void {

    this.interTime = setInterval(() => {

      this.updateOptions = {
        series: {
          data: this.myDataSource
        }
      };

      // if (this.chartDiv != null) {
      //   //console.log(this.divUpponChart.nativeElement.offsetWidth)
      //       this.renderer.setStyle(
      //         this.chartDiv, 
      //         'width', 
      //         this.divUpponChart.nativeElement.offsetWidth+'px'
      //       );
      // }
      // this.mychart.resize({
      //   width: 1500
      // });
      //console.log(this.mychart);

    }, 250);

    var dts = this.dataStorage.getQueuePt().toArray()
    if (dts.length > 30) {
      dts = dts.slice(-29, 0);
    }
    dts.forEach((cyls) => {

      // if (this.PosIdx == 1 ) {
      //   console.log(cyls.Status[this.PosIdx-1].RealForce);
      // }
      this.myDataSource.push(cyls.Status[this.PosIdx - 1].RealForce);
      //console.log(cyls.Status[this.PosIdx-1].RealForce);
    });


    //this.myDataSource = [8.20, 9.32, 9.01, 9.34, 12.90, 14.30, 15.50, 12.00, 14.50, 16.80];
    // this.updateOptions = {
    //   series: {
    //     data: this.myDataSource
    //   }
    // };



    //console.log(this.myDataSource.length);


    this.realDtSubscription = this.webSock.getSubject().subscribe(this.printdt.bind(this));

  }


  ngAfterViewInit() {
    //console.log(this.divUpponChart.nativeElement.offsetWidth);
    var hElement: HTMLElement = this.elRef.nativeElement;

    //now you can simply get your elements with their class name
    var chartBox = hElement.getElementsByClassName('chartBox');

    //console.log(chartBox[0].firstChild);
    // this.renderer.setStyle(
    //   chartBox[0].firstChild, 
    //   'width', 
    //   `$this.divUpponChart.nativeElement.offsetWidthpx`
    // );
  }

  chartDiv: any;
  onChartInit(event: any) {
    //console.log(event);

    //console.log(event._dom.firstChild);
    this.chartDiv = event._dom.firstChild;

    //this.myDataSource =  
    //this.chart = $event;
    // this.chart.showLoading({
    // text:'数据努力加载中...',
    // });
  }
  @ViewChild('mychart')
  mychart!: echarts.ECharts

  @ViewChild('divUpponChart')
  divUpponChart!: ElementRef;

  // changeSize(){
  //     console.log("size changed");
  // }

  updateOptions: any;
  myDataSource: number[] = [];

  @Input() chartOption: echarts.EChartsOption = {
    responsive: false,
    maintainAspectRatio: false,
    //responsive: false,
    //responsive: true,
    // showScale: false,
    // maintainAspectRatio: false,
    toolbox: {
      show: false,
    },
    tooltip: {
      show: false,
    },
    legend: {
      show: false,
    },
    grid: [
      { left: '15%' },
    ],
    series: [{
      data: this.myDataSource,
      type: 'line',
      showSymbol: false,
      symbol: 'none',
      name: '',
    }],

    yAxis: [
      {
        gridIndex: 0,
        max: 20,
        min: -20,
        type: 'value',
        splitLine: {
          show: true
        }
      },
    ],

    xAxis: [
      {
        type: 'category',
        min: 0,
        max: 200,
        axisTick: { show: false },
        name: '时间',
        splitLine: {
          show: false
        }
      }
    ],
    //animation:false,
    /*
    dataset: {
      source: this.myDataSource,
      type:'line',
    },
*/

  };

  @Input() vRealForce!: number;

  count: number = 0;
  printdt(msg: any) {
    // if (this.count>1)
    //   return;
    //   this.count++;
    // console.log(msg);

    // var dts = this.dataStorage.getQueuePt().toArray()
    // this.myDataSource = [];

    this.vRealForce = msg.Status[this.PosIdx - 1].RealForce.toFixed(2);

    if (this.myDataSource.length > 30) {
      this.myDataSource.shift();
    }
    this.myDataSource.push(this.vRealForce);

    // this.updateOptions = {
    //   series: {
    //     data: this.myDataSource
    //   }
    //   // series: [{
    //   //   data: this.myDataSource
    //   // }]
    // };



    // dts.forEach( (cyls)=>{ 

    //   // if (this.PosIdx == 1 ) {
    //   //   console.log(cyls.Status[this.PosIdx-1].RealForce);
    //   // }
    //   // this.myDataSource.push(cyls.Status[this.PosIdx-1].RealForce);
    // });
  }

  action2(n: number) {
    var orders: HttpReq_Order[] = [];
    let ord = new HttpReq_Order;
    ord.CmdCode = n;
    ord.Param1 = this.PosIdx;

    orders.push(ord);
    console.log("post me");
    this.http.post("http://192.168.1.236:9088/SetCmds", orders, httpOptions).subscribe({
      complete: () => { console.log("completed"); }, // completeHandler
      error: (e) => { console.log(e) },    // errorHandler 
      next: (res: any) => {
        console.log(res);
      },     // nextHandler
    });
  }

  @ViewChild('slider') slider: any;
  @Input() vSlider: number = 0;
  action(n: number) {
    var orders: HttpReq_Order[] = [];
    let ord = new HttpReq_Order;
    ord.Param1 = this.PosIdx;

    if (n == 1 && this.slider.value != 0) {

      if (this.slider.value > 0) {
        ord.CmdCode = 3;
        ord.Param5 = this.slider.value * 100;
      } else {
        ord.CmdCode = 4;
        ord.Param5 = this.slider.value * -100;
      }

      orders.push(ord);
      console.log("post me");
      this.http.post("http://192.168.1.236:9088/SetCmds", orders, httpOptions).subscribe({
        complete: () => { console.log("completed"); }, // completeHandler
        error: (e) => { console.log(e) },    // errorHandler 
        next: (res: any) => {
          console.log(res);
        },     // nextHandler
      });
    }

    if (n == 0) {
      ord.CmdCode = 1;

      orders.push(ord);
      console.log("post me");
      this.http.post("http://192.168.1.236:9088/SetCmds", orders, httpOptions).subscribe({
        complete: () => { console.log("completed"); }, // completeHandler
        error: (e) => { console.log(e) },    // errorHandler 
        next: (res: any) => {
          this.slider.value = 0;
          console.log(res);
        },     // nextHandler
      });
    }
  }









  //-----------------------------------------
  /*
    @Input() id:any;
    InitVal:any[] = [];
    @Input('Init') 
    set setInit(val:any){
      if(this.chart === undefined){
        this.InitVal = val;
      }else{
        this.ngZone.runOutsideAngular(()=>{
          this.chartOption.xAxis[0].data  = val[0];
          this.chartOption.series[0].data = val[1];
          this.chartOption.series[1].data = val[2];
        });
      };
    };
    yData:any;
    @Input('YAxis') 
    set setY2(ydata:any){
      if(this.chart === undefined){
        this.yData = ydata;
      }else{
        this.ngZone.runOutsideAngular(()=>{
          this.chartOption.series[2].data = ydata;
        });
      };
    };
    
    yChange:any;
    CutChangeTime:boolean = false;
    @Input('YChange')
    set setYchange1(yVal:any){
      if(this.chart === undefined){
        this.yChange = yVal;
      }else{
        this.chartOption.series[2].data.push(yVal.value);
        if(this.CutChangeTime){
          this.CutChangeTime = false;
        }else{
          this.ngZone.runOutsideAngular(()=>{
            this.chart.setOption(this.chartOption);
          });
          this.CutChangeTime = true;
        };
      };
    };
  
    peakVal:any;
    @Input('AddPeak')
    set setPeak(value){
      if(this.chart === undefined){
        this.peakVal = value;
      }else{
        this.ngZone.runOutsideAngular(()=>{
          this.chartOption.series[0].data.push(value.max);
          this.chartOption.series[1].data.push(value.min);
          this.chartOption.xAxis[0].data.push(value.x);
        });
      };
    };
  
    config:any;
    @Input('Config')
    set setConfig(val){
      if(this.chart == undefined){
        this.config = val;
      }else{
        // console.log('val' + val);
        this.ngZone.runOutsideAngular(()=>{
          this.chartOption.xAxis[1].data = val.x;
          if(val.ymax == 0){
            this.chartOption.yAxis[0].max =  20;
            this.chartOption.yAxis[1].max =  20;
          }else{
            this.chartOption.yAxis[0].max = Math.ceil(val.ymax * 1.2);
            this.chartOption.yAxis[1].max = val.ymax;
          };
          if(val.ymin == 0){
            this.chartOption.yAxis[0].min =  -20;
            this.chartOption.yAxis[1].min =  -20;
          }else{
            this.chartOption.yAxis[0].min = Math.ceil(val.ymin * (-1) * 1.2);
            this.chartOption.yAxis[1].min = val.ymin * (-1);
          };
        });
      };
    };
    
    chart:any;
    onChartInit($event){
      this.chart = $event;
      this.chart.showLoading({
        text:'数据努力加载中...',
      });
      if(this.yData !== undefined){
        this.chartOption.series[0].data = this.yData;
      };
      if(this.config !== undefined){
        this.chartOption.xAxis[1].data = this.config.x;
         if(this.config.ymax == 0){
          this.chartOption.yAxis[0].max = 20;
          this.chartOption.yAxis[1].max = 20;
        }else{
          this.chartOption.yAxis[0].max = Math.ceil(this.config.ymax * 1.2);
          this.chartOption.yAxis[1].max = Math.ceil(this.config.ymax * 1.2);
        };
        if(this.config.ymin == 0){
          this.chartOption.yAxis[0].min = -20;
          this.chartOption.yAxis[1].min = -20;
        }else{
          this.chartOption.yAxis[0].min = Math.ceil(this.config.ymin * (-1) * 1.2);
          this.chartOption.yAxis[1].min = Math.ceil(this.config.ymin * (-1) * 1.2);
        };
      };
      if(this.InitVal.length !== 0){
        this.chartOption.xAxis[0].data = this.InitVal[0];
        this.chartOption.series[0].data = this.InitVal[1];
        this.chartOption.series[1].data = this.InitVal[2];
      };
      this.chart.setOption(this.chartOption);
      this.chart.hideLoading();
    };
  
    */
}

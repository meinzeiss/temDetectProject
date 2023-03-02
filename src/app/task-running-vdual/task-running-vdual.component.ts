import { Component, Input, OnInit } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-task-running-vdual',
  templateUrl: './task-running-vdual.component.html',
  styleUrls: ['./task-running-vdual.component.css']
})
export class TaskRunningVDualComponent implements OnInit {
  
  public taskCfg?:string;

  realDtSubscription:any;
  webSock:WebSocketService;
  dataStorage:DataStorageService;
  
  xAxisData:number[] = [];
  constructor( storage: DataStorageService, ws:  WebSocketService) {
    this.webSock = ws;
    this.dataStorage = storage;
    
    for (let i = 0; i < 100; i++) {
      this.xAxisData.push(i);
    }

   }

  ngOnDestroy(): void {
    this.realDtSubscription.unsubscribe();
    clearInterval(this.interTime);
  }



  interTime:any
  ngOnInit(): void {
    //console.log(this.taskCfg);
    
    this.interTime = setInterval(()=>{
      
      this.updateOptions1 = {
        series: {
          data: this.myDataSource1
        }
      };
      this.updateOptions2 = {
        series: {
          data: this.myDataSource2
        }
      };
    },300);

    var dts = this.dataStorage.getQueuePt().toArray()
    if (dts.length > 100) {
      dts = dts.slice(-99,0);
    }
    dts.forEach( (cyls)=>{ 
    
      this.myDataSource1.push(cyls.Status[0].RealForce);
      //console.log(cyls.Status[this.PosIdx-1].RealForce);
      this.myDataSource2.push(cyls.Status[1].RealForce);
    });
   
    this.realDtSubscription = this.webSock.getSubject().subscribe(this.printdt.bind(this));

  }


  updateOptions1: any;
  updateOptions2: any;
  myDataSource1 :number[]= [];
  myDataSource2 :number[]= [];

  @Input()  chartOption: echarts.EChartsOption = {
    //responsive: false,
          //responsive: true,
          // showScale: false,
          // maintainAspectRatio: false,
    toolbox: {
      show:false,
                },
          tooltip:{
show:false,
          },
    legend:{
      show:false,
    },
    grid: [
        {left:'15%'},
    ],
    series: [{
      // data: this.myDataSource,
      type: 'line',
      showSymbol: false,
      symbol: 'none',
      name:'',
    }],

    yAxis: [
      {
        gridIndex: 0,
        max:20,
        min:-20,
        type: 'value',
        splitLine:{
        　show:true
      }},
  ],

    xAxis: [
      {
        type: 'category',
        min:0,
        max:100,
        axisTick:{show:false},
        name:'',
      }
    ],

  };



  count:number = 0;
  printdt(msg:any)  {

      if (this.myDataSource1.length > 100) {
        this.myDataSource1.shift();
        this.myDataSource1.push(msg.Status[0].RealForce);
      } else {
        this.myDataSource1.push(msg.Status[0].RealForce);
      }
      
      if (this.myDataSource2.length > 100) {
        this.myDataSource2.shift();
        this.myDataSource2.push(msg.Status[1].RealForce);
      } else {
        this.myDataSource2.push(msg.Status[1].RealForce);
      }


  }

  onChartInit(event:any) {
  }


}

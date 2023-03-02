import { Component, Input, OnInit } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-task-running-vsingle',
  templateUrl: './task-running-vsingle.component.html',
  styleUrls: ['./task-running-vsingle.component.css']
})
export class TaskRunningVSingleComponent implements OnInit {

  public taskCfg:any;

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


  poses!:number[];
  interTime:any
  ngOnInit(): void {
    //console.log(this.taskCfg);
    this.poses = this.taskCfg.Pos;
    this.interTime = setInterval(()=>{
      
      this.updateOptions1 = {
        series: {
          data: this.myDataSource1
        }
      };
    },300);

    var dts = this.dataStorage.getQueuePt().toArray()
    if (dts.length > 100) {
      dts = dts.slice(-99,0);
    }
    dts.forEach( (cyls)=>{ 
    
      this.myDataSource1.push(cyls.Status[this.poses[0]-1].RealForce);
    });
   
    this.realDtSubscription = this.webSock.getSubject().subscribe(this.printdt.bind(this));

  }


  updateOptions1: any;
  myDataSource1 :number[]= [];

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
      let tmpDt = msg.Status[this.poses[0]-1].RealForce
      //console.log( this.poses[0]-1)
      //console.log(tmpDt);
      if (this.myDataSource1.length > 100) {
        this.myDataSource1.shift();
      }
      this.myDataSource1.push(tmpDt);

  }

}

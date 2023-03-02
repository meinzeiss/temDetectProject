import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSliderChange } from '@angular/material/slider';

interface PosSelect {
  value: string;
  viewValue: string;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    // Authorization: 'my-auth-token'
  }) 
};

@Component({
  selector: 'app-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.css']
})
export class MenuViewComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  pos: PosSelect[] = [
    {value: '1', viewValue: '工位1'},
    {value: '2', viewValue: '工位2'},
    {value: '3', viewValue: '工位3'},
  ];

  //@Input() xxValue!: number;
  
  // setValue_XX(event: MatSliderChange){
  //   //console.log("val");
  //   if (event.value == null) return;
  //   this.xxValue = event.value;
  // }

  @Input() contentShow:boolean = false;
  barMode:ProgressBarMode = 'determinate';
  posIdx:number=0;
  selChanged(evnt:any) {
    this.dealDownMenu(evnt.value);
  }

  dealDownMenu(idx: number) {

    this.barMode = 'query' ;
     this.http.get("http://192.168.1.236:9088/getMenuParam?Pos="+idx,  httpOptions).subscribe({
       complete: () => { 
        this.barMode = 'determinate' ;
       }, // completeHandler
       error: (e) => { console.log(e) },    // errorHandler 
       next: (res:any) => {
         this.posIdx = idx;
         this.contentShow = true;
        for (let i = 0;i < this.showSaveMark.length; i++) {
          this.showSaveMark[i] = false;
        }
         console.log(res);
         this.SliderActMaxSeconds.value = res.RtnData.OrderMaxRunSeconds
         this.mapSliderVals.set(this.SliderActMaxSeconds, res.RtnData.OrderMaxRunSeconds);
         
         this.SliderFSensorOLSafeRange_Pull.value = res.RtnData.ForceSensorPullOverloadRate*-1;
         this.mapSliderVals.set(this.SliderFSensorOLSafeRange_Pull, res.RtnData.ForceSensorPullOverloadRate*-1);   
               
         this.SliderFSensorOLSafeRange_Push.value = res.RtnData.ForceSensorPushOverloadRate
         this.mapSliderVals.set(this.SliderFSensorOLSafeRange_Push, res.RtnData.ForceSensorPushOverloadRate);
         
         this.SliderTForceDDeviationRate.value = res.RtnData.TargetForceLowerDeviationRate
         this.mapSliderVals.set(this.SliderTForceDDeviationRate, res.RtnData.TargetForceLowerDeviationRate);
         
         this.SliderTForceUDeviationRate.value = res.RtnData.TargetForceUpperDeviationRate
         this.mapSliderVals.set(this.SliderTForceUDeviationRate, res.RtnData.TargetForceUpperDeviationRate);
         
         this.SliderForceFactorB.value = res.RtnData.ForceFactorB
         this.mapSliderVals.set(this.SliderForceFactorB, res.RtnData.ForceFactorB);      
         
         this.SliderForceDownRange.value = res.RtnData.ForceFallProtectRate
         this.mapSliderVals.set(this.SliderForceDownRange, res.RtnData.ForceFallProtectRate);         
         
         this.SliderProportionalRate.value = res.RtnData.ProportionalValve
         this.mapSliderVals.set(this.SliderProportionalRate, res.RtnData.ProportionalValve);
         
         this.SliderSensorCapacity.value = res.RtnData.ForceSensorCapacity
         this.mapSliderVals.set(this.SliderSensorCapacity, res.RtnData.ForceSensorCapacity);    
         
         this.SliderMaxActSecondsBeforeReachForce.value = res.RtnData.MaxSecondsBeforeReachForce
         this.mapSliderVals.set(this.SliderMaxActSecondsBeforeReachForce, res.RtnData.MaxSecondsBeforeReachForce);
         
         this.SliderFSensorSampleOLSafeRnage.value = res.RtnData.SampleForceOverloadRate
         this.mapSliderVals.set(this.SliderFSensorSampleOLSafeRnage, res.RtnData.SampleForceOverloadRate);

       },     // nextHandler
     });
  }


  @Input() showSaveMark:boolean[] = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
  
  mapSliderVals = new Map<any, number>();

  @ViewChild('SliderActMaxSeconds')SliderActMaxSeconds:any;
  @ViewChild('SliderFSensorOLSafeRange_Push')SliderFSensorOLSafeRange_Push:any;
  @ViewChild('SliderFSensorOLSafeRange_Pull')SliderFSensorOLSafeRange_Pull:any;
  @ViewChild('SliderMaxActSecondsBeforeReachForce')SliderMaxActSecondsBeforeReachForce:any;
  @ViewChild('SliderForceDownRange')SliderForceDownRange:any;
  @ViewChild('SliderProportionalRate')SliderProportionalRate:any;
  @ViewChild('SliderTForceUDeviationRate')SliderTForceUDeviationRate:any;
  @ViewChild('SliderTForceDDeviationRate')SliderTForceDDeviationRate:any;
  @ViewChild('SliderForceFactorB')SliderForceFactorB:any;
  @ViewChild('SliderSensorCapacity')SliderSensorCapacity:any;
  @ViewChild('SliderFSensorSampleOLSafeRnage')SliderFSensorSampleOLSafeRnage:any;
  @ViewChild('SliderActMaSliderStandWeightxSeconds')SliderStandWeight:any;

  sliderValChanged(idx:number, evnt:any) {
    //console.log(evnt);
    //trg.value = evnt.value;
    let itm = this.mapSliderVals.get(evnt.source);
    if (itm == undefined) {
      this.showSaveMark[idx] = true;
      return;
    }
    if ( evnt.value == itm) {
      this.showSaveMark[idx] = false;
    } else {
      this.showSaveMark[idx] = true;
    }
  }

  
  save(){
    if (this.posIdx== 0 ) return;
    //console.log("not 0");
    
    let saveItms = [];
    this.barMode = 'query' ;

    if (this.mapSliderVals.get(this.SliderActMaxSeconds) != this.SliderActMaxSeconds.value ) { 
      saveItms.push(
        {
          CmdCode:10,
          Param1:this.posIdx *1,
          Param2:this.SliderActMaxSeconds.value,
        }
      )
    }

    if (this.mapSliderVals.get(this.SliderFSensorOLSafeRange_Push) != this.SliderFSensorOLSafeRange_Push.value || this.mapSliderVals.get(this.SliderFSensorOLSafeRange_Pull) != this.SliderFSensorOLSafeRange_Pull.value)  { 
      saveItms.push(
        {
          CmdCode:11,
          Param1:this.posIdx *1,
          Param4:this.SliderFSensorOLSafeRange_Push.value,
          Param5:this.SliderFSensorOLSafeRange_Pull.value*-1,
        }
      )
    }
    
    if (this.mapSliderVals.get(this.SliderMaxActSecondsBeforeReachForce) != this.SliderMaxActSecondsBeforeReachForce.value ) { 
      saveItms.push(
        {
          CmdCode:17,
          Param1:this.posIdx *1,
          Param2:this.SliderMaxActSecondsBeforeReachForce.value,
        }
      )
    }
    
    if (this.mapSliderVals.get(this.SliderForceDownRange) != this.SliderForceDownRange.value ) { 
      saveItms.push(
        {
          CmdCode:16,
          Param1:this.posIdx *1,
          Param4:this.SliderForceDownRange.value,
        }
      )
    }
    
    if (this.mapSliderVals.get(this.SliderProportionalRate) != this.SliderProportionalRate.value ) { 
      saveItms.push(
        {
          CmdCode:20,
          Param1:this.posIdx *1,
          Param4:this.SliderProportionalRate.value,
        }
      )
    }
    
    if (this.mapSliderVals.get(this.SliderTForceUDeviationRate) != this.SliderTForceUDeviationRate.value || this.mapSliderVals.get(this.SliderTForceDDeviationRate) != this.SliderTForceDDeviationRate.value)  { 
      saveItms.push(
        {
          CmdCode:21,
          Param1:this.posIdx *1,
          Param4:this.SliderTForceUDeviationRate.value,
          Param5:this.SliderTForceDDeviationRate.value,
        }
      )
    }
    
    if (this.mapSliderVals.get(this.SliderForceFactorB) != this.SliderForceFactorB.value ) { 
      saveItms.push(
        {
          CmdCode:33,
          Param1:this.posIdx *1,
          Param4:this.SliderActMaxSeconds.value,
        }
      )
    }
    
    if (this.mapSliderVals.get(this.SliderSensorCapacity) != this.SliderSensorCapacity.value ) { 
      saveItms.push(
        {
          CmdCode:34,
          Param1:this.posIdx *1,
          Param4:this.SliderSensorCapacity.value,
        }
      )
    }

    if (this.mapSliderVals.get(this.SliderFSensorSampleOLSafeRnage) != this.SliderFSensorSampleOLSafeRnage.value ) { 
      saveItms.push(
        {
          CmdCode:15,
          Param1:this.posIdx*1,
          Param4:this.SliderFSensorSampleOLSafeRnage.value,
        }
      )
    }

    if (saveItms.length == 0 ) return;
    
    if (saveItms.length > 8 ){
      return;
    }

    
    this.barMode = 'query' ;
     this.http.post("http://192.168.1.236:9088/setMenuParams",saveItms,  httpOptions).subscribe({
       complete: () => { 
        this.barMode = 'determinate' ;
       }, // completeHandler
       error: (e) => { console.log(e) },    // errorHandler 
       next: (res:any) => {
        this.dealDownMenu(this.posIdx);

       },     // nextHandler
     });


  }

}


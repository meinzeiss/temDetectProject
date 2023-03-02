import { Injectable, } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Observable, Subject ,Subscription,of} from 'rxjs';
import { Queue } from 'mnemonist';
import { group } from '../app/real-time-chart-view/real-time-chart-view.component';

const CacheSelectedKey:string = 'LastSelectedStatus';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  queuePt:Queue<any>; //  max len:100
  getQueuePt() {
    return this.queuePt;
  }
  // queue5PtCompress:Queue<any>;  //  max len:100
  // getQueue5Pt() {
  //   return this.queue5PtCompress;
  // }
  // queue20PtCompress:Queue<any>; //  max len:100
  // getQueue20Pt() {
  //   return this.queue20PtCompress;
  // }
  transfer:any;
  wsSubscription: Subscription;

  constructor(private ws:WebSocketService) { 
    this.queuePt = new Queue<any>();
    //console.log(this.queuePt);
    // this.queue5PtCompress = new Queue<any>();
    // this.queue20PtCompress = new Queue<any>();

    this.wsSubscription = this.ws.getSubject().subscribe(this.saveData.bind(this));
    this.transfer = new Observable();
    
  }

  pt5Counter:number = 0;
  pt20Counter:number = 0;
  cnt :number = 0;

  saveData(saveData: any) {
    //console.log("get data");    
    // console.log('[start] DataStorage.size = ',this.queuePt.size);
    if (this.queuePt.size >= 600) {
      this.queuePt.dequeue();
    }
    this.queuePt.enqueue(saveData);
    // console.log('[end] DataStorage.size = ',this.queuePt.size);
/*
    this.pt5Counter++;
    if (this.pt5Counter >4) {
      this.pt5Counter = 0;

      //var n = crypto.randomInt(0,4);
      this.queue5PtCompress.enqueue(this.queuePt.toArray()[3]);
      if (this.queue5PtCompress.size>100) {
        this.queue5PtCompress.dequeue();
      }
    } 

    this.pt20Counter++;
    if (this.pt20Counter >19) {
      this.pt20Counter = 0;

      //var n = crypto.randomInt(0,19);
      this.queue20PtCompress.enqueue(this.queuePt.toArray()[11]);
      if (this.queue20PtCompress.size>100) {
        this.queue20PtCompress.dequeue();
      }
    } 
    */
  }

  subscribe(fn: any) {
    return this.transfer.subscribe(fn);
  }


  mapTaskBaseInfo = new Map<string, any>();
  saveTaskInfo(uid:string, jsCfg:any) {
    this.mapTaskBaseInfo.set(uid, jsCfg);
  }

  getTaskInfo(uid:string) {
    return this.mapTaskBaseInfo.get(uid);
  }

  
  cacheRealChartSelectedResult(groups:group[]){
    let selectedStr:string = '';
    let saveData = null;
    if(groups != null && groups != undefined && groups.length > 0){
      let selectedStr:string = '';
      for (let x = 0; x < groups.length; x++) {
        for (let y = 0; y < groups[x].channels.length; y++) {
          selectedStr = selectedStr.concat(`${groups[x].channels[y].checked},`);          
        }        
      }
      if(selectedStr.length > 0 && selectedStr.lastIndexOf(',') > 0){
        selectedStr = selectedStr.substring(0,selectedStr.length-1);
        saveData = {
          value: selectedStr,
        }
      }
      // console.log(selectedStr);
      // console.log(JSON.stringify(saveData));
    }
    localStorage.setItem(CacheSelectedKey,JSON.stringify(saveData));
    // console.log('cacheRealChartSelectedResult');
  }
  getCacheRealChartSelectedResult(){
    var cache = localStorage.getItem(CacheSelectedKey);
    // console.log('cache: ',cache);
    var str = cache != null ? JSON.parse(cache).value : '';
    // console.log('str: ',str);
    return str;
  }
}


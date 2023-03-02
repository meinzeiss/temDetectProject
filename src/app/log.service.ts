import { Injectable } from '@angular/core';
import { Queue } from 'mnemonist';
import { NGXLogger } from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class LogService {
  queuePt: Queue<any>; //  max len:100
  customlog: NGXLogger;
  cmptName: string = 'LogService';
  isShowing: boolean = false;

  getQueuePt() {
    return this.queuePt;
  }
  constructor(private logger: NGXLogger) {
    this.queuePt = new Queue<any>();
    this.customlog = logger;
  }

  trace(component: string, ...args: any[]) {
    let time = new Date().toISOString();
    if (this.isShowing) {
      this.customlog.trace(component, args);
    }
    this.saveData(`[${time}] ${component}-trace: ${args}`);
  }
  debug(component: string, ...args: any[]) {
    let time = new Date().toISOString();
    if (this.isShowing) {
      this.customlog.debug(component, args);
    }
    this.saveData(`[${time}] ${component}-debug: ${args}`);
  }
  info(component: string, ...args: any[]) {
    let time = new Date().toISOString();
    if (this.isShowing) {
      this.customlog.info(component, args);
    }
    this.saveData(`[${time}] ${component}-info: ${args}`);
  }
  warn(component: string, ...args: any[]) {
    let time = new Date().toISOString();
    if (this.isShowing) {
      this.customlog.warn(component, args);
    }
    this.saveData(`[${time}] ${component}-warn: ${args}`);
  }
  error(component: string, ...args: any[]) {
    let time = new Date().toISOString();
    if (this.isShowing) {
      this.customlog.error(component, args);
    }
    this.saveData(`[${time}] ${component}-error: ${args}`);
  }
  saveData(saveData: any) {
    // console.log(`save data = ${saveData}`);
    if (this.queuePt.size >= 50) {
      this.queuePt.dequeue();
    }
    this.queuePt.enqueue(saveData);
  }

  getLastDataByCnt(cnt: number) {
    if (cnt < 1 || this.queuePt.size == 0) {
      return [];
    } else {
      let tmpArray = new Array();
      let saveArray = this.queuePt.toArray();
      let idx = saveArray.length - cnt > 0 ? saveArray.length - cnt : 0;
      for (let i = idx; i < saveArray.length; i++) {
        var tmpItem = saveArray[i];
        if (tmpItem != null && tmpItem != undefined) {
          tmpArray.push(tmpItem);
        }
      }
      // let jsonStr = JSON.stringify(tmpItem);
      // console.warn(`Warnning: ${jsonStr}`);
      // this.info(this.cmptName,jsonStr);
      // let size = tmpArray.length;
      // this.info(this.cmptName,`queue size = ${size}`);
      return tmpArray;
    }
  }

}

import {  Component, OnInit } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dual-cylinder-task',
  templateUrl: './dual-cylinder-task.component.html',
  styleUrls: ['./dual-cylinder-task.component.css']
})
export class DualCylinderTaskComponent implements OnInit {

  constructor() { }

  barMode:ProgressBarMode = 'determinate';
  
  ngOnInit(): void {
  }

  barShow = true;
  poses = [
    {
      value : 1,
      viewValue: "工位1",
    },
    {
      value : 2,
      viewValue: "工位2",
    },
  ];
  taskTypes = [
    {
      value : 1,
      viewValue: "单推",
    },
    {
      value : 2,
      viewValue: "单拉",
    },
    {
      value : 3,
      viewValue: "推拉",
    },
  ]
  
  public runTask(){
    this.barMode = 'query' ;
  }

}

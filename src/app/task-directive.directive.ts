import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[taskDirective]'
})
export class TaskDirectiveDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}

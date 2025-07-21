// Impossible Angular v20.x.x
// Dynamic Input

// Dynamic input for component created by ViewContainerRef

//  Add to root template
// <app-dyn-input></app-dyn-input>

import {Component, effect, inject, input, model, signal, ViewContainerRef, WritableSignal} from '@angular/core';

@Component({
  selector: 'app-count-label',
  template: `Created in <b>{{ label() }}</b>: Count: {{ count() }}`,
  styles: `:host {
    display: block;
  }`
})
export class CountLabelComponent {
  label = input('Template')
  count = model(0)

  count$: WritableSignal<number> = signal(0)

  constructor() {
    effect(() => {
      this.count.set(this.count$())
    })
  }
}


@Component({
  selector: 'app-dyn-input',
  imports: [
    CountLabelComponent
  ],
  template: `
    <button (click)="countClick()">Count ++</button>
    <app-count-label [count]="dynCount()"></app-count-label>
    <button (click)="addLabelClick()">Add cnt</button>
  `
})
export class DynInputComponent {

  dynCount = signal(0)
  readonly viewContainerRef = inject(ViewContainerRef)

  countClick() {
    this.dynCount.update(v => ++v)
  }

  addLabelClick() {
    const comp = this.viewContainerRef.createComponent(CountLabelComponent)
    comp.setInput('label', 'ViewContainerRef')
    comp.instance.count$ = this.dynCount
  }

}

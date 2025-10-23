// Impossible Angular v20.x.x
// @Host vs @Self
// @Self vs @Host
// Author: Sergii Lutchyn

// One crucial difference between `self` and `host` parameters for service injection.
// It is projection!

//  Usage:
// <app-item appTestService label="Parent" color="grey">
//   <app-item appTestService label="Projected 1st level" color="skyblue">
//     <app-item label="Projected 2nd level" color="lime">
//     </app-item>
//   </app-item>
// </app-item>


import {Component, Directive, inject, Injectable, input} from '@angular/core';

@Injectable()
export class TestService {
  readonly ID: string

  constructor() {
    this.ID = 'ID-' + Math.random().toString(36).substring(2, 7).toUpperCase()
  }
}

@Directive({
  selector: '[appTestService]',
  providers: [TestService]
})
export class AppTestServiceDirective {
}

@Component({
  selector: 'app-item',
  template: `
    <div [style.background]="color()">
      <h2>{{ label() }}</h2>
      <h3>Self: {{ self?.ID ?? 'NULL' }}</h3>
      <h3>Host: {{ host?.ID ?? 'NULL' }}</h3>
      @if (isParent()) {
        <app-item label="Child" [isParent]="false"></app-item>
      }
      <ng-content></ng-content>
    </div>
  `,
  imports: [],
  styles: `
    h2, h3 {
      margin: 2px;
    }

    div {
      padding: 10px;
      margin: 10px;
      border: 2px gray solid;
    }
  `
})
export class ItemComponent {

  label = input('')
  color = input('white')
  isParent = input(true)

  self = inject(TestService, {self: true, optional: true})
  host = inject(TestService, {host: true, optional: true})

}

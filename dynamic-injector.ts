// Impossible Angular v20.x.x
// Dynamic Injector
// Dynamic Injector
// Author: Sergii Lutchyn

// Service injection to class's method or event
// Using global variable and injector from boot App

//  Usage:
// <app-toolbar></app-toolbar>
// <app-add-message></app-add-message>
// <app-del-message></app-del-message>


// add to main.ts
// .then((app) => setAppInjector(app.injector))

// app-injector.ts ***********************************************************************************

import { Injector } from '@angular/core'

let APP_INJECTOR: Injector

export function setAppInjector(injector: Injector) {
  APP_INJECTOR = injector
}

export { APP_INJECTOR }

// **************************************************************************************************


import { Component, inject, Injectable } from '@angular/core'
import { APP_INJECTOR } from './app-injector'

@Injectable(
  {providedIn: 'root'}
)
export class MessagesService {
  count = 0
}

const setMessageCount = (cnt: number) => {
  APP_INJECTOR.get(MessagesService).count += cnt
}


@Component({
  selector: 'app-toolbar',
  template: `
    <hr>
    <h1>Message count: {{ messages?.count }}</h1>
    <hr>
  `
})
export class ToolbarComponent {
  messages = inject(MessagesService)
}

@Component({
  selector: 'app-add-message',
  template: `
    <button (click)="click()">Add Message</button>`
})
export class AddMessageComponent {
  click() {
    setMessageCount(1)
  }
}

@Component({
  selector: 'app-del-message',
  template: `
    <button (click)="click()">Del Message</button>`
})
export class DelMessageComponent {
  click() {
    setMessageCount(-1)
  }
}

# Impossible Angular

Source codes from youtube chnage https://www.youtube.com/@ImpossibleAngular

- [Dynamic Providers](#DynamicProviders)
- [Dynamic Injector](#DynamicInjector)

## Dynamic Providers

**Briefly**: Services dynamically injected into providers. Directive share providers with a component and
`createComponent()` method can add directive to component in runtime.

**Usage:** 
```HTML
<app-widget-container></app-widget-container>`
```

Use token `FOOD_TOKEN` to inject services. For every service you want to inject dynamically need to create directive.

```TypeScript
export interface IFood {
  label: string
  list: Array<string>
}

export const FOOD_TOKEN = new InjectionToken<IFood>('FoodToken')

@Injectable()
export class FruitsService implements IFood {
  label = 'Fruits'
  list = ['Mango', 'Chery', 'Grape']
}
@Directive({
  providers: [{provide: FOOD_TOKEN, useFactory: () => new FruitsService()}]
})
export class FruitsDirective {
}

@Injectable()
export class VegetablesService implements IFood {
  label = 'Vegetables'
  list = ['Carrot', 'Avocado', 'Onion']
}

@Directive({
  providers: [{provide: FOOD_TOKEN, useFactory: () => new VegetablesService()}]
})
export class VegetablesDirective {
}
```

Widget where we apply dynamic provider.

```TypeScript
@Component({
  selector: 'app-widget',
  template: `
    <h1>{{ food.label }}</h1>
    @for (item of food.list; track item) {
      <p>{{ item }}</p>
    }
`,
  styles: `
    :host {
      display: block;
      border: 2px solid black;
      width: 200px
    }`
})
export class WidgetComponent {
  food = inject(FOOD_TOKEN)
}
```

Root component `app-widget-container` where widget component dynamically created with any providers. 

```TypeScript
@Component({
  selector: 'app-widget-container',
  template: `
    <button (click)="fruitClick()">Fruit</button>
    <button (click)="vegetablesClick()">Vegetables</button>
  `
})
export class WidgetContainerComponent {
  private widget = inject(ViewContainerRef)

  fruitClick() {
    this.widget.createComponent(WidgetComponent, {directives: [FruitsDirective]})
  }

  vegetablesClick() {
    this.widget.createComponent(WidgetComponent, {directives: [VegetablesDirective]})
  }

}
```


## Dynamic Injector

**Briefly**: Service injection to class's method or event
Using global variable and app injector inside bootstrapApplication(...)

**Usage:**
```HTML
<app-toolbar></app-toolbar>
<app-add-message></app-add-message>
<app-del-message></app-del-message>
```

**Add to main.ts into bootstrapApplication(...)**`.then((app) => setAppInjector(app.injector))`

```TypeScript
bootstrapApplication(App, appConfig)
>>>.then((app) => setAppInjector(app.injector))
  .catch((err) => console.error(err))
```

**app-injector.ts**
```TypeScript
let APP_INJECTOR: Injector

export function setAppInjector(injector: Injector) {
  APP_INJECTOR = injector
}

export { APP_INJECTOR }
```

MessagesService provided in root
```TypeScript
@Injectable(
  {providedIn: 'root'}
)
export class MessagesService {
  count = 0
}

const setMessageCount = (cnt: number) => {
  APP_INJECTOR.get(MessagesService).count += cnt
}
```

Toolbar with display message count
```TypeScript
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
```

Two stay along components where used helper function with dynamic injection `setMessageCount(N)`
```TypeScript
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
```

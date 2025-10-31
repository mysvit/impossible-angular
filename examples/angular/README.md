## Angular examples

- [ng command](#ng-command)
- [Circular dependency with forwardRef](#circular-dependency-with-forwardref)
- [Simplified implementation of ControlValueAccessor (CVA)](#simplified-implementation-of-controlvalueaccessor-cva)
- [Directives](#directives)
- [RxJS](#rxjs)
- [NgRx](#ngrx)

### ng command

Install latest `angular cli`

``` shell
npm install --location=global @angular/cli@latest
```

Then new minimalistic `test` project.
```shell
ng new test --minimal --zoneless --style scss --ssr false --ai-config none
```

Check updates
```shell
ng update
```

Update angular packages
```shell
ng update @angular/cli @angular/core
```

### Circular dependency with forwardRef

[**Source file:** forward-ref.ts](forward-ref.ts)

**Briefly**: To resolve circular dependency use `forwardRef`

**Usage:**
```HTML
<app-parent></app-parent>`
```

InjectionToken for parent component `PARENT_COMPONENT`

```TypeScript
export const PARENT_COMPONENT = new InjectionToken<ParentComponent>('Parent Component Instance')
```

Child component where we inject and use parent component

```TypeScript
@Component({
    selector: 'app-child',
    template: `Child call parent's method`
})
export class ChildComponent {
    // Inject parent component throw InjectionToken
    private parent = inject<ParentComponent>(PARENT_COMPONENT)

    constructor() {
        this.parent.greet('ChildComponent')
    }

}
```

Parent component where we defined a provider to itself. 

```TypeScript
@Component({
    selector: 'app-parent',
    template: `
        <p>Parent Component</p>
        <app-child></app-child>
    `,
    imports: [ChildComponent],
    providers: [
        {
            provide: PARENT_COMPONENT,
            useExisting: forwardRef(() => ParentComponent)
        }
    ]
})
export class ParentComponent {
    // Simple method for the child to call
    greet(name: string): void {
        console.log(`Hello, ${name}! I am your Parent component.`)
    }
}
```

### Simplified implementation of ControlValueAccessor (CVA)

[**Source file:** my-cva.ts](my-cva.ts)

**Briefly**: This example is designed to illustrate key Angular concepts, such as Dependency Injection, and core JavaScript techniques, including closures and callback functions.

**Usage:**
```HTML
<app-my-form></app-my-form>`
```

**Hot it works.**
The component registered a provider that references itself (using forwardRef and useExisting), allowing it to serve as the value accessor and implement the necessary functions for form change tracking.
The directive uses the host component's reference to inject it , to apply FormControl's value to the host component
 and register callback functions (base on interface implementation) for change detection and validation.

### Directives

[**Source file:** directives.ts](directives.ts)

**Briefly**: Examples of attribute and structural directives. 

**Usage:**
See the comments in the file.

### RxJS

[**Source file:** rxjs.ts](rxjs.ts)

**Briefly**: An example of common usage of RxJS functions.

**Usage:** In the constructor uncomment the function that you want to run.
```angular2html
<app-rxjs></app-rxjs>
```
* **of**: emits an array as a single value and as separate values as well.
* **from**: emits contents of array as separate values.
* **retry**: an error handling operator that resubscribes to the source observable if it throws an error.
* **catchError**: an error handling operator that intercepts an error in the observable stream.
* **Higher order mapping**: to get the result from one Observable and send it to another. Using switchMap, mergeMap, concatMap depends on the incoming stream.
* **switchMap** - cancels any previous inner observable subscriptions that are still in progress.
* **mergeMap** - subscribes to all inner observables concurrently.
* **concatMap** - subscribes to inner observables one at a time.
* **forkJoin** - runs all observables in parallel and waits for all of them to complete, return array of values.
* **concat** - chains observables together, running them sequentially, one-by-one manner.
* **take** - take n values from stream.
* **takeUntil** - cancel subscription with teardown subject.
* **takeWhile** - cancel subscription when condition is false.
* **scan** - handling continuous accumulation and emission of values, similar to .reduce((acc, cur)) function in array.
* **withLatestFrom** - combine main stream with one or more others.

### NgRx

Install NgRx store
```shell
ng add @ngrx/store@latest
```

Install NgRx store devtools in project. In Chrome add extension `Redux DevTools`
```shell
ng add @ngrx/store-devtools@latest
```

## Angular examples

- [Circular dependency with forwardRef](#circular-dependency-with-forwardref)
- [Simplified implementation of ControlValueAccessor (CVA)](#simplified-implementation-of-controlvalueaccessor-cva)

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

# Angular examples

- [Circular dependency with forwardRef](#Circular-dependency-with-forwardRef)

### Circular dependency with forwardRef

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

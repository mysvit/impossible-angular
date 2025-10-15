// Angular Examples v20.x.x
// forwardRef & circular dependency

// Get parent's method from child

// start point <app-parent></app-parent>

import { Component, forwardRef, inject, InjectionToken } from '@angular/core'

export const PARENT_COMPONENT = new InjectionToken<ParentComponent>('Parent Component Instance')

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

@Component({
    selector: 'app-parent',
    template: `
        <p>Parent Component</p>
        <app-child></app-child>
    `,
    imports: [ChildComponent],
    // *** This is where the circular reference occurs ***
    providers: [
        {
            provide: PARENT_COMPONENT,
            // 2. Alias: Use the existing instance of ParentComponent (the component itself)
            //    This is where we must use forwardRef, as ParentComponent is not fully
            //    defined yet when the providers array is evaluated.
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

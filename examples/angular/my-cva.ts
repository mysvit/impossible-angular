// Angular Examples v20.x.x
// forwardRef & circular dependency

// This simplified implementation of ControlValueAccessor (CVA) is designed to illustrate key Angular concepts,
// such as Dependency Injection, and core JavaScript techniques, including closures and callback functions.

// How it works.
// The component registered a provider that references itself (using forwardRef and useExisting),
// allowing it to serve as the value accessor and implement the necessary functions for form change tracking.
//    The directive uses the host component's reference to inject it , to apply FormControl's value to the host component
// and register callback functions (base on interface implementation) for change detection and validation.

// start point <app-my-form></app-my-form>

import { Component, Directive, effect, forwardRef, inject, InjectionToken, input, signal, WritableSignal } from '@angular/core'
import { FormsModule } from '@angular/forms'

// This token is used within the directive to inject the component that implements ControlValueAccessor, and to register a provider for that component.
export const MY_FORM_CONTROL = new InjectionToken<IMyValueControlAccessor>('My control')

// simplified ValueControlAccessor
export interface IMyValueControlAccessor {
    value: any
    writeValue: (value: any) => void

    registerOnChange(fn: (_: any) => void): void
}

// simplified ValidatorFn
type MyValidatorFn = (control: MyFormControl) => boolean | null

// simplified FormControl with simple validator
export class MyFormControl {

    readonly validatorFn?: MyValidatorFn
    private value: WritableSignal<any> = signal(null)
    isValid: WritableSignal<boolean> = signal(false)

    constructor(value: any, validatorFn?: MyValidatorFn) {
        this.value.set(value)
        this.validatorFn = validatorFn
    }

    get getValue() {
        return this.value.asReadonly()
    }

    setValue(value: any) {
        this.value.set(value)
    }

    validate() {
        if (this.validatorFn) {
            this.isValid.set(this.validatorFn(this) ?? false)
        }
    }
}

// simplified FormControl directive
// all magic here
@Directive({
    selector: '[myFormControl]'
})
export class MyFormControlDirective {

    formControlItem = input.required<MyFormControl>({alias: 'myFormControl'})
    // host ValueControlAccessor component
    private componentAccessor = inject<IMyValueControlAccessor>(MY_FORM_CONTROL)

    constructor() {
        // register a local callback function for change event,
        // and .bind(this) is used to bind its context to the directive.
        this.componentAccessor.registerOnChange(this.onChange.bind(this))
        // Sets the initial value and updates it within the host component
        effect(() => {
            console.log('effect compare',
                this.formControlItem().getValue(), '!==', this.componentAccessor.value)
            // if changes came from host component by calling onChange() within .writeValue() its prevent run it again
            // but call writeValue() if changes originate from the data model by calling setValue(...) on the form FormControl instance
            if (this.formControlItem().getValue() !== this.componentAccessor.value) {
                console.log('effect writeValue to accessor', this.formControlItem().getValue())
                this.componentAccessor.writeValue(this.formControlItem().getValue())
            }
        })
    }

    // The callback function that is registered and executed within the CVA component, apply changes to the FormControl and triggers validation.
    onChange(value: any) {
        console.log('onChange FormControl', value)
        this.formControlItem().setValue(value)
        this.formControlItem().validate()
    }

}

// The CVA component has a circular dependency declaration.
// that allow to inject this component into directive plus the onChange() registration
@Component({
    selector: 'app-my-input',
    template: `<input [ngModel]="value" (ngModelChange)="writeValue($event)">`,
    imports: [
        FormsModule
    ],
    providers: [
        {
            provide: MY_FORM_CONTROL,
            useExisting: forwardRef(() => MyInputComponent)
        }
    ]
})
export class MyInputComponent implements IMyValueControlAccessor {
    value: any

    writeValue(value: any): void {
        this.value = value
        this.onChange(value)
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    onChange: any = () => {
    }
}

// The example component creates a FormControl instance and uses the [formControl] directive
// to link it to the accessor component, applying the necessary validation rules.
@Component({
    selector: 'app-my-form',
    imports: [
        MyFormControlDirective,
        MyInputComponent
    ],
    template: `
        <p>Value from control: {{ myForm.getValue() }}</p>
        <p>Validator: value < 5 is {{ myForm.isValid() }}</p>
        <app-my-input [myFormControl]="myForm"></app-my-input>
        <button (click)="click()">set to default</button>
    `
})
export class MyFormComponent {

    private minValidator = (minValue: number): MyValidatorFn => {
        return (control: MyFormControl) => {
            return control.getValue() < minValue
        }
    }
    myForm = new MyFormControl(0, this.minValidator(5))

    click() {
        this.myForm.setValue(0)
    }

}

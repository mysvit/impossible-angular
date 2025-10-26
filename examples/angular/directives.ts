// Impossible Angular v20.x.x
// Attribute and structural directives
// Author: Sergii Lutchyn

import { Attribute, Directive, effect, ElementRef, HostListener, inject, Injectable, input, Renderer2, signal, TemplateRef, ViewContainerRef } from '@angular/core'

// Color attribute for h1 selector
// Usage:
// <h1 ia-color="red">Red color</h1>
@Directive({
    selector: 'h1'
})
export class H1ColorDirective {

    readonly elementRef = inject(ElementRef)
    readonly renderer = inject(Renderer2)

    constructor(@Attribute('ia-color') private color: string) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'color', this.color)
    }

}

// Color attribute for any selector
// Usage:
// <p ia-color="green">Green color</p>

@Directive({
    selector: '[ia-color]'
})
export class AnyColorDirective {

    readonly color = input.required<string>({alias: 'ia-color'})

    readonly elementRef = inject(ElementRef)
    readonly renderer = inject(Renderer2)

    constructor() {
        effect(() => {
            this.renderer.setStyle(this.elementRef.nativeElement, 'color', this.color())
        })
    }

}

// Highlight on hover attribute for any selector
// Usage:
// <h2 ia-highlight>Highlight on hover</h2>
@Directive({
    selector: '[ia-highlight]'
})
export class HighlightDirective {

    @HostListener('mouseenter') onMouseEnter() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'yellow')
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', this.previousColor)
    }

    readonly elementRef = inject(ElementRef)
    readonly renderer = inject(Renderer2)
    readonly previousColor?: string

    constructor() {
        this.previousColor = this.elementRef.nativeElement.style.color
    }

}


// *ia-show structural directive similar to @If
// Usage:
// <p *ia-show="false">Show me after 1s</p>

@Directive({
    selector: '[ia-show]'
})
export class ShowDirective {

    readonly isShow = input.required<boolean>({alias: 'ia-show'})
    readonly templateRef = inject<any>(TemplateRef)
    readonly viewContainer = inject(ViewContainerRef)

    constructor() {
        effect(() => {
            if (this.isShow()) {
                this.viewContainer.createEmbeddedView(this.templateRef)
            } else {
                this.viewContainer.clear()
            }
        })
    }

}

// *ia-msg structural directive similar to @if with "as"
// using $implicit parameter
// Usage:
// <h3>Message count example</h3>

// what is looks better for you?

// template
// variant 1
// @if (messageState.getMsg(); as msg) {
//     <div>{{ msg?.type }}</div>
// }
// @if (messageState.getMsg(); as msg) {
//     <div>{{ msg?.cnt }}</div>
// }

// variant 2
// <div *ia-msg="let msg">{{ msg().type }}</div>
// <div *ia-msg="let msg">{{ msg().cnt }}</div>

// ts file
// readonly message = inject(MessageState)
// constructor() {
//     this.message.setMsg({type: 'global', cnt: 0})
//     setTimeout(() => {
//         this.message.clearMsg()
//     }, 7000)
//     interval(3000).subscribe(
//         {
//             next: (val) => this.message.setMsg({type: 'local', cnt: val})
//         }
//     )
// }

export type Msg = { type: string, cnt: number }

@Injectable({providedIn: 'root'})
export class MessageState {
    readonly message = signal<Msg | null>(null)
    getMsg = this.message.asReadonly()
    setMsg = (value: Msg) => {
        this.message.update(obj => ({...obj, ...value}))
    }
    clearMsg = () => this.message.set(null)
}

@Directive({
    selector: '[ia-msg]'
})
export class ShowMessageCountDirective {

    readonly templateRef = inject(TemplateRef<{ $implicit: Msg }>)
    readonly viewContainer = inject(ViewContainerRef)
    readonly messageState = inject(MessageState)

    private hasShown: boolean = false

    constructor() {
        effect(() => {
                if (this.messageState.getMsg() && !this.hasShown) {
                    this.hasShown = true
                    this.viewContainer.createEmbeddedView(this.templateRef,
                        {$implicit: this.messageState.getMsg})
                } else if (this.messageState.getMsg() === null && this.hasShown) {
                    this.hasShown = false
                    this.viewContainer.clear()
                }
            }
        )
    }

}

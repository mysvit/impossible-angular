import { Component, signal, WritableSignal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import {
    catchError,
    concat,
    concatMap,
    delay,
    filter,
    forkJoin,
    from,
    interval,
    map,
    mergeMap,
    Observable,
    of,
    retry,
    scan,
    Subject,
    switchMap, take,
    takeUntil,
    takeWhile,
    withLatestFrom
} from 'rxjs'
import { tap } from 'rxjs/operators'

@Component({
    selector: 'app-rxjs',
    template: ``
})
export class RxjsComponent {

    constructor() {
        static_of_from()
        // map_retry_catchError()
        // higherOrderMapping()
        // map_switchMap()
        // map_mergeMap()
        // map_concatMap()
        // static_forkJoin()
        // static_concat()
        // takeUntil_Signal()
        // takeUntil_Subject()
        // static_scan()
        // map_withLatestFrom()
    }

}

const static_of_from = () => {
    title('rxjs functions: of, from')
    tick()
    of([1, 2, 3]).pipe(delay(1000), tap(value => console.warn('of - Array of([1,2,3])', value))).subscribe()
    of(1, 2, 3).pipe(delay(2000), tap(value => console.warn('of - by commas of(1,2,3)', value))).subscribe()
    from([1, 2, 3]).pipe(delay(3000), tap(value => console.warn('from - Array from([1,2,3])', value))).subscribe()
}

//
const map_retry_catchError = () => {
    title('retry: resubscribes to the source after failure')
    title('catchError: intercepts an error in the observable stream')
    let attemptCount = 0
    // Observable simulating a request that fails most of the time
    const unstableRequest = new Observable<Array<number>>(subscriber => {
        attemptCount++
        console.log(`--- Attempt #${attemptCount} initiated ---`)
        // Simulate an error on the first three attempts
        if (attemptCount < 4) {
            const err = `Simulate failed on attempt ${attemptCount}`
            console.error(err)
            subscriber.error(new Error(err))
        } else {
            // Succeed on the fourth attempt
            subscriber.next([1,2,3])
            subscriber.complete()
        }
    })

    // --- Execution ---
    setTimeout(() =>
            unstableRequest.pipe(
                // 1. Log the error before retry kicks in
                // catchError(err => {
                //     console.error(`Error detected: ${err.message}`)
                //     // Re-throw the error to trigger the retry mechanism
                //     return throwError(() => err)
                // }),
                // 2. The core mechanism: Retry the Observable up to 3 times with delay 1s
                // retry(3),
                retry({count: 3, delay: 1000}),
                map(value => console.warn('Get data after 3 retry', value)),
                catchError(() => {
                    console.error('Operation failed after all retries.')
                    return of(false)
                })
            ).subscribe()
        , 100)
}

const title = (values: string) => setTimeout(() => console.warn(values), 100)

const obs = (val: number) => of(val).pipe(delay(val * 1000))

const tick = () => {
    interval(1000)
        // .pipe(takeWhile((val) => val < 10)) // cancel subscription when condition is false.
        .pipe(take(10)) // take n values from stream
        .subscribe({next: (value) => console.log(`tick: ${value + 1}s`)})
}

const higherOrderMapping = () => {
    title('To get the result from one Observable and send it to another. Using switchMap')
    tick()
    return obs(1)
        .pipe(
            tap((value) => console.warn(`higherOrderMapping 1 - ${value}s`)),
            switchMap(value => obs(value + 1)),
            tap((value) => console.warn(`higherOrderMapping switchMap 2 - ${value}s`)),
            switchMap(value => obs(value + 1)),
            tap((value) => console.warn(`higherOrderMapping switchMap 3 - ${value}s`))
        ).subscribe()
}

const map_switchMap = () => {
    title('switchMap [3$,2$,1$] - cancels any previous inner observable subscriptions that are still in progress')
    tick()
    return of(obs(3), obs(2), obs(1))
        .pipe(
            switchMap(value => value),
            tap(value => console.warn(`switchMap - ${value}`))
        ).subscribe()
}

const map_mergeMap = () => {
    title('mergeMap [3$,2$,1$] - subscribes to all inner observables concurrently')
    tick()
    return of(obs(3), obs(2), obs(1))
        .pipe(
            mergeMap(value => value),
            tap((value) => console.warn(`mergeMap - ${value}`))
        ).subscribe()
}

const map_concatMap = () => {
    title('concatMap [3$,2$,1$] - subscribes to inner observables one at a time')
    tick()
    return of(obs(3), obs(2), obs(1))
        .pipe(
            concatMap(value => value),
            tap((value) => console.warn(`concatMap - ${value}s`))
        ).subscribe()
}

const static_forkJoin = () => {
    title('forkJoin [3$,2$,1$] - runs all observables in parallel and waits for all of them to complete')
    tick()
    forkJoin([obs(3), obs(2), obs(1)])
        .pipe(
            tap((value) => console.warn(`forkJoin [${value}]`))
        ).subscribe()
}

const static_concat = () => {
    title('concat [3$,2$,1$] - chains observables together, running them sequentially, one-by-one manner')
    tick()
    concat(obs(3), obs(2), obs(1))
        .pipe(
            tap((value) => console.warn(`concat ${value}s`))
        ).subscribe()
}

const takeUntil_Signal = () => {
    title('To stop stream used takeUntil which triggered by signal')
    tick()
    const stopSignal: WritableSignal<boolean> = signal(false)
    // convert signal to observable
    const stopSignalToObservable = toObservable(stopSignal)
        .pipe(
            // signal act like BehaviorsSubject
            // use filter to let just 'true' values pass through
            filter(isStopped => isStopped === true),
            tap((value) => console.warn(`STOP SIGNAL EMITTED ${value}!`))
        )
    // stream interval
    interval(1000) // Emits 0, 1, 2, ... every 1 second
        .pipe(
            takeUntil(stopSignalToObservable)
        )
        .subscribe({
            next: (value) => console.warn(value),
            complete: () => console.warn('Observable stopped by Signal!')
        })
    // send stop signal
    setTimeout(() => stopSignal.set(true), 5000)
}

const takeUntil_Subject = () => {
    title('To stop stream used takeUntil which triggered by Subject')
    tick()
    const stopSubject: Subject<boolean> = new Subject<boolean>()
    // stream interval
    interval(1000) // Emits 0, 1, 2, ... every 1 second
        .pipe(
            takeUntil(stopSubject)
        )
        .subscribe({
            next: (value) => console.warn(value),
            complete: () => console.warn('Observable stopped by Subject!')
        })
    // send stop signal
    setTimeout(() => stopSubject.next(true), 5000)
}

const static_scan = () => {
    title('scan - handling continuous accumulation and emission of values.')
    tick()
    // sum elements
    of(obs(1), obs(2), obs(3))
        .pipe(
            delay(10),
            tap(() => title('rxjs function: scan((acc, curr) => acc + curr, 0) to sum elements')),
            mergeMap((value) => value),
            tap(value => console.warn('value: ', value)),
            scan((acc, curr) => acc + curr, 0),
            tap(value => console.warn('scan (acc + curr) from (1,2,3)', value))
        ).subscribe()
    // build array
    of(obs(1), obs(2), obs(3))
        .pipe(
            delay(5000),
            tap(() => title('rxjs function: scan((acc, curr) => [...acc, curr], []) to build array')),
            mergeMap((value) => value),
            tap(value => console.warn('value: ', value)),
            scan((acc, curr) => [...acc, curr], [] as number[]),
            tap(value => console.warn('scan [...acc, curr] from (1,2,3)', value))
        ).subscribe()
}

const map_withLatestFrom = () => {
    title('withLatestFrom - combine main stream with one ore more other')
    tick()
    // const clicks = fromEvent(document, 'click');
    const clicks = interval(2000)
    const timer = interval(1000)
    clicks.pipe(
        withLatestFrom(timer),
        tap((value) => console.warn(`click ${value[0]}s`, `stream data ${value[1]}, `))
    ).subscribe()
}

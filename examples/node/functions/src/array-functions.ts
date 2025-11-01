/**
 * Impossible Angular v20.x.x
 * Author: Sergii Lutchyn
 *
 * All this function used to update one object in array by id in different way
 * All input parameters remain mutable
 * You can ensure immutability by using:
 * - Object.freeze() (for a shallow freeze)
 * - structuredClone() (to create a deep copy)
 *
 * updateArrayTest() - test performance function
 */


export const updateArrayById_filter = <T extends { id: number | string }>(arr: Array<T>, obj: T): T[] => {
    return arr.filter(f => f.id !== obj.id)
}

/**
 * Update array object by id using map
 * @param arr
 * @param obj
 */
export const updateArrayById_map = <T extends { id: number | string }>(arr: Array<T>, obj: T): T[] => {
    return arr.map((item) => {
        if (item.id === obj.id) {
            return obj
        }
        return item
    })
}

/**
 * Update array object by id using slice + concat
 * @param arr
 * @param obj
 */
export const updateArrayById_findIndex_con = <T extends { id: number | string }>(arr: Array<T>, obj: T): T[] => {
    const index = arr.findIndex(f => f.id === obj.id)
    if (index >= 0) {
        return arr.slice(0, index).concat(obj).concat(arr.slice(index + 1))
    } else {
        return arr
    }
}

export const updateArrayById_findIndex_des = <T extends { id: number | string }>(arr: Array<T>, obj: T): T[] => {
    const index = arr.findIndex(f => f.id === obj.id)
    if (index >= 0) {
        return [
            ...arr.slice(0, index),
            obj,
            ...arr.slice(index + 1)
        ]
    } else {
        return arr
    }
}

/**
 *
 * @param arr
 * @param obj
 * @param index
 */
export const updateArrayById_index_des = <T extends { id: number | string }>(arr: Array<T>, obj: T, index: number): T[] => {
    return [
        ...arr.slice(0, index),
        obj,
        ...arr.slice(index + 1)
    ]
}

export const updateArrayById_index_con = <T extends { id: number | string }>(arr: Array<T>, obj: T, index: number): T[] => {
    return arr.slice(0, index).concat(obj).concat(arr.slice(index + 1))
}

export const updateArrayById_for = <T extends { id: number | string }>(arr: Array<T>, obj: T): T[] => {
    const newArray: Array<T> = []
    for (const item of arr) {
        if (item.id === obj.id) {
            newArray.push(obj)
        } else {
            newArray.push(item)
        }
    }
    return newArray
}


/**
 * Test performance of array functions
 */

type Item = {
    id: number | string
    name: string
    items: Array<Item>
}

const generateArray = (count: number): Item[] => {
    const result = []
    for (let i = 0; i < count; i++) {
        result.push({id: 'id-' + i, name: i.toString(), items: [{id: i, name: i.toString(), items: []}]} as Item)
    }
    return result
}

const newObj = (index: number): Item => {
    return {id: 'id-' + index, name: 'A'.repeat(index), items: []} as Item
}

const performancePercent = (mainProcess: number, secondProcess: number): any => {
    const smallerNum = mainProcess < secondProcess ? mainProcess : secondProcess
    return Math.round(((secondProcess - mainProcess) / smallerNum) * 100)
}

const consoleSpeed = (str: string, speed: number) => {
    console.warn(str, Math.round(speed * 100) / 100, 'ms')
}

export const updateArrayTest = () => {

    const ARRAY_SIZE = 100100
    const ARRAY_STEP = 20
    console.warn('Array update and destruction performance test')
    console.warn('Array size: ', ARRAY_SIZE, 'Update times: ', ARRAY_SIZE / ARRAY_STEP)

    const arr = generateArray(ARRAY_SIZE)

    // test using [key: value] index, slice and destructor
    let arrayIndexMap = performance.now()
    const indexMap = arr.reduce((acc: any, item, index: number) => {
        acc[item.id] = index
        return acc
    }, {})
    const createIndexMap = performance.now() - arrayIndexMap
    consoleSpeed('create IndexMap [key: value]:index ........ ', createIndexMap)

    arrayIndexMap = performance.now()
    for (let i = 0; i < ARRAY_SIZE; i += ARRAY_STEP) {
        const obj = newObj(i)
        updateArrayById_index_des(arr, obj, indexMap[obj.id])
    }
    arrayIndexMap = performance.now() - arrayIndexMap
    consoleSpeed('performance indexMap destructing ......... ', arrayIndexMap)
    consoleSpeed('performance indexMap destructing + index.. ', arrayIndexMap + createIndexMap)

    // test using [key: value] index, slice and concat
    let arrayIndexMapCon = performance.now()
    for (let i = 0; i < ARRAY_SIZE; i += ARRAY_STEP) {
        const obj = newObj(i)
        updateArrayById_index_con(arr, obj, indexMap[obj.id])
    }
    arrayIndexMapCon = performance.now() - arrayIndexMapCon
    consoleSpeed('performance indexMap concat .............. ', arrayIndexMapCon)
    consoleSpeed('performance indexMap concat + index....... ', arrayIndexMapCon + createIndexMap)

    // test using findIndex function with destruction
    let arrayFindIndex = performance.now()
    for (let i = 0; i < ARRAY_SIZE; i += ARRAY_STEP) {
        updateArrayById_findIndex_des(arr, newObj(i))
    }
    arrayFindIndex = performance.now() - arrayFindIndex
    consoleSpeed('performance findIndex destructing ........ ', arrayFindIndex)

    // test using findIndex function
    let arrayFindIndexCon = performance.now()
    for (let i = 0; i < ARRAY_SIZE; i += ARRAY_STEP) {
        updateArrayById_findIndex_des(arr, newObj(i))
    }
    arrayFindIndexCon = performance.now() - arrayFindIndexCon
    consoleSpeed('performance findIndex concat ............. ', arrayFindIndex)

    let arrayMap = performance.now()
    for (let i = 0; i < ARRAY_SIZE; i += ARRAY_STEP) {
        updateArrayById_map(arr, newObj(i))
    }
    arrayMap = performance.now() - arrayMap
    consoleSpeed('performance map .......................... ', arrayMap)

    let arrayFor = performance.now()
    for (let i = 0; i < ARRAY_SIZE; i += ARRAY_STEP) {
        updateArrayById_for(arr, newObj(i))
    }
    arrayFor = performance.now() - arrayFor
    consoleSpeed('performance for .......................... ', arrayFor)

    let arrayFilter = performance.now()
    for (let i = 0; i < ARRAY_SIZE; i += ARRAY_STEP) {
        updateArrayById_filter(arr, newObj(i))
    }
    arrayFilter = performance.now() - arrayFilter
    consoleSpeed('performance filter ...................... ', arrayFilter)


    console.warn()
    console.warn('compare to map (+):faster (-):slower')
    console.warn(`just by index destructing .... ${performancePercent(arrayMap, arrayIndexMap)}%, `)
    console.warn(`index destruct + createIndex . ${performancePercent(arrayMap, arrayIndexMap + createIndexMap)}%, `)
    console.warn(`just by index concat ......... ${performancePercent(arrayMap, arrayIndexMapCon)}%, `)
    console.warn(`index concat + createIndex ... ${performancePercent(arrayMap, arrayIndexMap + createIndexMap)}%, `)
    console.warn(`findIndex destructing ........ ${performancePercent(arrayMap, arrayFindIndex)}%`)
    console.warn(`findIndex concat ............. ${performancePercent(arrayMap, arrayFindIndexCon)}%`)
    console.warn(`for push ..................... ${performancePercent(arrayMap, arrayFor)}%`)
    console.warn(`filter ....................... ${performancePercent(arrayMap, arrayFilter)}%`)
}

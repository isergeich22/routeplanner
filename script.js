const input = document.querySelector('#text')
const inputS = document.querySelector('#textSend')
const inputQ = document.querySelector('#textQuantity')
const addButton = document.querySelector('#add')
const addSend = document.querySelector('#addSend')
const content = document.querySelector('.route-list')
const sends_list = document.querySelector('.delivery-list')
const finalSum = document.querySelector('.finalsum')
const total = document.querySelector('#finalsum')
const startsum = document.querySelector('#startsum')
const finalRoad = document.querySelector('#finalroad')
const getRoad = document.querySelector('#get-road')
const getStart = document.querySelector('#get-start')
const getFinal = document.querySelector('#get-final')
const leftOver = document.querySelector('#finalleftover')
const getLeftover = document.querySelector('#get-leftover')
const removeStart = document.querySelector('#remove-start')
const removeRoad = document.querySelector('#remove-road')
const lsKey = 'POINT'
const lsKey_ = 'ROAD'
const _lsKey = 'COIN'
const ls_Key = 'SEND'

const points = getState()
const coins = getStateCoins()
const roads = getStateRoads()
const sends = getStateSends()

const date_ob = new Date()

let day = ''
let month = ''

date_ob.getDate() - 10 < 0 ? day = `0${date_ob.getDate()}`: day = date_ob.getDate()
date_ob.getMonth() - 10 < 0 ? month = `0${date_ob.getMonth() + 1}`: month = date_ob.getMonth()+1

removeStart.addEventListener('click', () => {
    localStorage.removeItem(_lsKey)
    startsum.value = '0'
    getStart.disabled = false
})

removeRoad.addEventListener('click', () => {
    localStorage.removeItem(lsKey_)
    finalRoad.value = '0'
    getRoad.disabled = false
})

getStart.addEventListener('click', () => {
    createCoin(startsum.value)

    saveStateCoins()

    init()
})

getRoad.addEventListener('click', () => {
    createRoad(finalRoad.value)

    saveStateRoads()

    init()
})

addButton.addEventListener('click', () => {
    createPoint(input.value)

    saveState()
})

addSend.addEventListener('click', () => {
    createSend(inputS.value, inputQ.value)

    saveStateSends()
})

function createRoad(text) {
    if(text == '') {
        finalRoad.classList.toggle('invalid')

        setTimeout(() => {
            finalRoad.classList.remove('invalid')
        }, 3000)
    } else {
        const newRoad = {
            number: parseInt(text),
            date: `${day}/${month}`
        }

        finalRoad.value = ''

        roads.push(newRoad)
        saveStateRoads()
        init()

    }
}

function renderRoads() {
    if(roads.length == 0) {
        finalRoad.value = '0'
    } else {
        for(i = 0; i < roads.length; i++) {
            finalRoad.value = `${roads[i].number}`
            getRoad.disabled = true
        }
    }
}

function createCoin(text) {
    if (text == '') {
        startsum.classList.toggle('invalid')

        setTimeout(() => {
            startsum.classList.remove('invalid')
        }, 3000)
    } else {
        const newCoin = {
            number: parseInt(text),
            date: `${day}/${month}`
        }

        startsum.value = ''

        coins.push(newCoin)
        saveStateCoins()
        init()

    }
}

function renderCoins() {
    if(coins.length == 0) {
        startsum.value = '0'
    } else {
        for (i = 0; i < coins.length; i++) {
            startsum.value = `${coins[i].number}`
            getStart.disabled = true
        }
    }
}

function createPoint(text) {
    if (text == '') {
        input.classList.toggle('invalid')

        setTimeout(() => {
            input.classList.remove('invalid')
        }, 3000)
    } else {
        const newPoint = {
            point_name: text,
            point_sum: '0',
            done: false
        }

        input.value = ''

        points.push(newPoint)
        saveState()
        init()
    }

}

function renderPoints() {
    if(points.length == 0) {
        content.innerHTML = '<p>There is no points here | Здесь пока нет ни одного плана</p>'
        finalSum.style.display = 'none'
    } else {
        finalSum.style.display = 'flex'
        let html = ''
        for (i =0; i < points.length; i++) {
            if(points[i].done != true) {
                html += `<div class="card">
                            <input type="checkbox" name="done" id="done" ${points[i].done} data-point="${points[i].point_name}">
                            <label class="name" for="done">${points[i].point_name}</label>
                            <label class="cost" for="cost">Сумма: </label><input type="text" name="cost" class="cost-input" id="${(points[i].point_name).trim()}" value="${points[i].point_sum}">
                            <button type="submit" id="send" data-point="${points[i].point_name}">Отправить</button>
                            <button type="submit" id="remove" data-point="${points[i].point_name}">X</button>
                        </div>`
            } else {
                html += `<div class="card">
                            <input type="checkbox" name="done" id="done" data-point="${points[i].point_name}" checked>
                            <label class="name done" for="done">${points[i].point_name}</label>
                            <label class="cost" for="cost">Сумма: </label><input type="text" name="cost" class="cost-input" id="${points[i].point_name}" value="${points[i].point_sum}">
                            <button type="submit" id="send" data-point="${points[i].point_name}">Отправить</button>
                            <button type="submit" id="remove" data-point="${points[i].point_name}">X</button>
                        </div>`
            }
            content.innerHTML = html
            const checkbox = document.querySelectorAll('#done')
            const remove = document.querySelectorAll('#remove')
            const send = document.querySelectorAll('#send')
            checkbox.forEach(el => {
                el.addEventListener('click', togglePoint)
            })

            send.forEach(el => {
                el.addEventListener('click', (event) => {
                    const content = event.target.dataset.point
                    const point = points.find(p => p.point_name === content)
                    const index = points.indexOf(point)
                    
                    // console.log(document.querySelector(`#${content}`))
                    points[index].point_sum = parseInt(document.querySelector(`#${content}`).value)
                    saveState()
                    init()
                    countFinal()
                })
            })

            remove.forEach(el => {
                el.addEventListener('click', (event) => {
                    const content = event.target.dataset.point
                    const point = points.find(j => j.point_name === content)
                    let index = points.indexOf(point)
                    if(index > -1) {
                        points.splice(index, 1)
                    }                    
                    saveState()
                    init()
                    countFinal()
                })
            })

            saveState()
            
        }
    }
}

function createSend(text, quantity) {
    if(text == '') {
        inputS.classList.toggle('invalid')

        setTimeout(() => {
            inputS.classList.remove('invalid')
        }, 3000)
    } else {
        const newSend = {
            company: text,
            quantity: quantity,
            done: false
        }

        inputS.value = ''
        inputQ.value = ''

        sends.push(newSend)
        saveStateSends()
        init()
    }
}

function renderSends() {
    if(sends.length == 0) {
        sends_list.innerHTML = `<p>There is no sends here | Здесь пока нет ни одной отправки</p>`
    } else {
        let html = ''
        for(i = 0; i < sends.length; i++) {
            if(sends[i].done != true) {
                html += `<div class='card'>
                            <input type="checkbox" name="done" id="done_send" ${sends[i].done} data-send="${sends[i].company}">
                            <label class="name" for="done">${sends[i].company}</label>
                            <label class="quantity" for="done">Количество: ${sends[i].quantity}</label>
                            <button type="submit" id="remove" data-send="${sends[i].company}">X</button>
                        </div>`
            } else {
                html += `<div class='card'>
                            <input type="checkbox" name="done" id="done_send" data-send="${sends[i].company}" checked>
                            <label class="name done" for="done">${sends[i].company}</label>
                            <label class="quantity" for="done">Количество: ${sends[i].quantity}</label>
                            <button type="submit" id="remove" data-send="${sends[i].company}">X</button>
                        </div>`
            }
            sends_list.innerHTML = html
            const checkbox_send = document.querySelectorAll('#done_send')
            const remove = document.querySelectorAll('#remove')

            checkbox_send.forEach(el => {
                el.addEventListener('click', toggleSend)
            })

            remove.forEach(el => {
                el.addEventListener('click', (event) => {
                    const content = event.target.dataset.send
                    const send = sends.find(s => s.company === content)
                    let index = sends.indexOf(send)
                    if(index > -1) {
                        sends.splice(index, 1)
                    }                    
                    saveStateSends()
                    init()
                })
            })

            saveStateSends()

        }
    }
}

getFinal.addEventListener('click', countFinal)
getLeftover.addEventListener('click', getingLeftover)

function countFinal() {
    let sum = 0
    const inputs = document.querySelectorAll('.cost-input')
    inputs.forEach(el => {
        // console.log(el.value)
        sum += parseInt(el.value)
    })
    // console.log(inputs)
    total.value = sum
}

function getingLeftover() {
    leftOver.value = parseInt(startsum.value) - (parseInt(total.value) + parseInt(finalRoad.value))
}

function toggleSend(event) {
    const text = event.target.dataset.send
    const send = sends.find(s => s.company === text)
    send.done = event.target.checked
    saveStateSends()
    init()
}

function togglePoint(event) {
    const text = event.target.dataset.point
    const point = points.find(p => p.point_name === text)
    point.done = event.target.checked
    saveState()
    init()
}

function saveStateRoads() {
    localStorage.setItem(lsKey_, JSON.stringify(roads))
}

function getStateRoads() {
    const row = localStorage.getItem(lsKey_)
    return row ? JSON.parse(row) : []
}

function saveStateCoins() {
    localStorage.setItem(_lsKey, JSON.stringify(coins))
}

function getStateCoins() {
    const row = localStorage.getItem(_lsKey)
    return row ? JSON.parse(row) : []
}

function saveStateSends() {
    localStorage.setItem(ls_Key, JSON.stringify(sends))
}

function getStateSends() {
    const row = localStorage.getItem(ls_Key)
    return row ? JSON.parse(row):[]
}

function saveState() {
    localStorage.setItem(lsKey, JSON.stringify(points))    
}

function getState() {
    const row = localStorage.getItem(lsKey)
    return row ? JSON.parse(row) : []
}

function init() {
    renderPoints()
    renderCoins()
    renderRoads()
    renderSends()
}

init()
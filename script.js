const input = document.querySelector('#text')
const addButton = document.querySelector('#add')
const content = document.querySelector('.route-list')
const finalSum = document.querySelector('.finalsum')
const total = document.querySelector('#finalsum')
const startsum = document.querySelector('#startsum')
const getStart = document.querySelector('#get-start')
const getFinal = document.querySelector('#get-final')
const lsKey = 'POINT'
const _lsKey = 'COIN'

const points = getState()
const coins = getStateCoins()

const date_ob = new Date()

let day = ''
let month = ''

date_ob.getDate() - 10 < 0 ? day = `0${date_ob.getDate()}`: day = date_ob.getDate()
date_ob.getMonth() - 10 < 0 ? month = `0${date_ob.getMonth() + 1}`: month = date_ob.getMonth()+1

getStart.addEventListener('click', () => {
    createCoin(startsum.value)

    saveStateCoins()
})
addButton.addEventListener('click', () => {
    createPoint(input.value)

    saveState()
})

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
        saveState()
        init()

    }
}

function renderCoins() {
    if(coins.length == 0) {
        startsum.value = '0'
    } else {
        for (i = 0; i < coins.length; i++) {
            startsum.value = `${coins[i].number}`
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

getFinal.addEventListener('click', countFinal)

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

function togglePoint(event) {
    const text = event.target.dataset.point
    const point = points.find(p => p.point_name === text)
    point.done = event.target.checked
    saveState()
    init()
}

function saveStateCoins() {
    localStorage.setItem(_lsKey, JSON.stringify(coins))
}

function getStateCoins() {
    const row = localStorage.getItem(_lsKey)
    return row ? JSON.parse(row) : []
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
}

init()
const result = localStorage.getItem("score")
const parseResult = (JSON.parse(result))

const message = localStorage.getItem("message")
const rank = document.getElementById('rank')

rank.innerHTML = `<div>${message}</div>`

for (let key in parseResult) {
    rank.innerHTML += `<div class="result">${key}: ${parseResult[key]}</div>`
}
const info = (...params) => {
    console.log(...params)
}

const error = (...params) => {
    console.error
}

module.exports = {
    info, error
}
const fs = require('fs')
const bugs = require('../data/bug.json')

module.exports = {
    query,
    getById,
    remove,
    save,
}

const BUGS_PER_PAGE = 2

function query(filterBy) {
    const { byTitle, page } = filterBy
    const regex = new RegExp(byTitle, 'i')
    let filteredBugs = bugs.filter(bug => {
        return regex.test(bug.title)
    })
    const startIdx = Math.ceil(BUGS_PER_PAGE * page)
    const totalPages = Math.ceil(filteredBugs.length / BUGS_PER_PAGE)
    filteredBugs = filteredBugs.slice(startIdx, startIdx + BUGS_PER_PAGE)
    return Promise.resolve({ totalPages, filteredBugs })
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const idx = bugs.findIndex(currbug => currbug._id === bug._id)
        console.log(loggedinUser);
        if (loggedinUser._id !== bugs[idx].creator._id && !loggedinUser.isAdmin) return Promise.reject('only creator can update')
        bugs[idx] = { ...bug, creator: bugs[idx].creator }
    } else {
        bug._id = _makeId()
        bug.createdAt = new Date().getTime()

        bugs.unshift(bug)
    }
    return _savebugsToFile().then(() => bug)
}

function getById(bugId) {
    const currbug = bugs.find(bug => bug._id === bugId)
    return new Promise((resolve, reject) => {
        if (!currbug) reject('no bug with this id')
        else resolve(currbug)
    })
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (loggedinUser._id !== bugs[idx].creator._id && !loggedinUser.isAdmin) return Promise.reject('only creator can delete')
    bugs.splice(idx, 1)
    return _savebugsToFile(bugs).then(() => Promise.resolve(bugId))

}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _savebugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

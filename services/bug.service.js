import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('./data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 3

function query(filterBy = { txt: '', minSeverity: 0, sortBy: { type: 'title', desc: 1 },userId: '' }) {
    let filteredBugs = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }
    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.label) {
        filteredBugs = filteredBugs.filter(bug => bug.labels.includes(filterBy.label))
    }

    if (filterBy.userId) {
        filteredBugs = filteredBugs.filter(bug => bug.creator._id === filterBy.userId)
    }

    const sortBy = filterBy.sortBy || {}
    if (sortBy.type === 'createdAt') {
        filteredBugs.sort((b1, b2) => (b1.createdAt - b2.createdAt) * (sortBy.desc))
    }
    else if (sortBy.type === 'title') {
        filteredBugs.sort((b1, b2) => b1.title.localeCompare(b2.title) * (sortBy.desc))
    }

    else if (sortBy.type === 'severity') {
        filteredBugs.sort((b1, b2) => (b1.severity - b2.severity) * (sortBy.desc))
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave, user) {

    if (bugToSave._id) {
        if (!user.isAdmin && bugToSave.creator._id !== user._id) return Promise.reject('Not your bug')

        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugToSave = {
            _id: bugToSave._id,
            title: bugToSave.title,
            severity: bugToSave.severity,
            updatedAt: Date.now()
        }
        bugs[bugIdx].title = bugToSave.title
        bugs[bugIdx].severity = bugToSave.severity
        bugs[bugIdx].updatedAt = bugToSave.updatedAt
  
    } else {
        bugToSave = {
            _id: utilService.makeId(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            title: bugToSave.title,
            description: bugToSave.description || '',
            labels: [],
            severity: bugToSave.severity,
            creator: user
        }
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}
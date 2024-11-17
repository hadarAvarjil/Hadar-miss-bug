
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'


_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug
}


function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .then(bug => _setNextPrevBugId(bug))
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })

    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })

    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '', pageIdx: 0, label: '', sortBy: { type: 'title', desc: 1 }, userId: '' }
}

function getEmptyBug(title = '', severity = '', description = '') {
    return { title, severity, description }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }
}

function _setNextPrevBugId(bug) {
    return storageService.query(STORAGE_KEY).then((bugs) => {
        const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
        const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
        const prevBug = bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
        bug.nextBugId = nextBug._id
        bug.prevBugId = prevBug._id
        return bug
    })
}
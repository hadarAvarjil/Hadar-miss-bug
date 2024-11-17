const { useState, useEffect } = React
const { Link } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugFilter } from "../cmps/BugFilter.jsx"
import { BugList } from '../cmps/BugList.jsx'
import { BugSort } from "../cmps/BugSort.jsx"
import { userService } from '../services/user.service.js'


export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const user = userService.getLoggedinUser()

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(bugs => setBugs(bugs))
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }


    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onSetSortBy(sortBy) {
        setFilterBy(prevFilter => ({
            ...prevFilter,
            sortBy: { ...prevFilter.sortBy, ...sortBy }
        }))
    }

    function onChangePageIdx(diff) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }

    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <button className="btn" >
                    <Link to="/bug/edit">Add Bug ⛐</Link>
                </button>
                {user && user.isAdmin && (
                    <button className="btn">
                        <Link to="/user">Manage Users</Link>
                    </button>
                )}
            </section>
            <main>
                <BugFilter filterBy={{ ...filterBy }} onSetFilter={onSetFilter} />
                <BugSort sortBy={{ ...filterBy.sortBy }} onSetSortBy={onSetSortBy} />

                <button onClick={() => { onChangePageIdx(1) }}>+</button>
                {filterBy.pageIdx + 1 || ''}
                <button onClick={() => { onChangePageIdx(-1) }} disabled={filterBy.pageIdx === 0}>-</button>

                <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
            </main>
        </main>
    )
}

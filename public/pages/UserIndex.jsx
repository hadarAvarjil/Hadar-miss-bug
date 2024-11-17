import { useState, useEffect } from 'react'
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function UserIndex() {
    const [users, setUsers] = useState([])
    const loggedinUser = userService.getLoggedinUser()

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then(users => setUsers(users))
            .catch(err => {
                console.log('Error loading users:', err)
                showErrorMsg('Failed to load users')
            })
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                const updatedUsers = users.filter(user => user._id !== userId);
                setUsers(updatedUsers)
                showSuccessMsg('User removed successfully')
            })
            .catch(err => {
                console.log('Error removing user:', err)
                showErrorMsg('Failed to remove user')
            })
    }

    return (
        <section className="user-index">
            <h2>Manage Users</h2>
            <ul className="user-list">
                {users.map(user => (
                    <li key={user._id}>
                        <span>{user.fullName}</span>
                        <button onClick={() => onRemoveUser(user._id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </section>
    )
}
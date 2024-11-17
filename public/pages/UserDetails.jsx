const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { userService } from "../services/user.service.js"
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'



export function UserDetails() {

    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(user => {
                setUser(user)
                loadUserBugs(user._id)
            })
            .catch(err => {
                console.log('Error loading user:', err)
                navigate('/')
            })
    }

    function loadUserBugs() {
        const filterBy = { userId: params.userId };
        bugService.query(filterBy)
            .then(setUserBugs)
            .catch(err => {
                console.log('Error loading bugs:', err);
            });
    }

    function onBack() {
        navigate('/')
    }

    if (!user) return <div>Loading...</div>

    return (
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            <p>Here are the bugs created by {user.fullname}:</p>
            <BugList bugs={userBugs} onRemoveBug={() => {}} onEditBug={() => {}} />
            <button onClick={onBack}>Back</button>
        </section>
    )
}
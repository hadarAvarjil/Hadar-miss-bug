const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { userService } from '../services/user.service.js'


export function BugList({ bugs, onRemoveBug }) {
    const user = userService.getLoggedinUser()

    if (!bugs) return <div>Loading...</div>

    function isAllowed(bug) {
        if (!user) return false
        if (user.isAdmin) return true
        if (user._id !== bug.creator._id) return false

        return true
    }


    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button>
                        <Link to={`/bug/${bug._id}`}>Details</Link>
                    </button>
                    {user && isAllowed(bug) && <div>
                        <button onClick={() => onRemoveBug(bug._id)}>Remove Bug</button>
                        <button>
                            <Link to={`/bug/edit/${bug._id}`}>Edit</Link>
                        </button>
                    </div>}
                </section>
            </li>

            ))
            }
        </ul >
    )
}

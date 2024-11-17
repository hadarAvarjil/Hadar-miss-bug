import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 700))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
            case 'radio':
                value = target.value;
                break;

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { txt, minSeverity, label } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter Bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Search for Bug</label>
                <input value={txt} onChange={handleChange} name="txt" type="text" id="txt" />

                <label htmlFor="minSeverity">minSeverity</label>
                <input value={minSeverity || ''} onChange={handleChange} name="minSeverity" type="range" min="0" max="5" id="minSeverity" />

                <fieldset>
                    <legend>Select a Label</legend>
                    <label>
                        <input
                            type="radio"
                            name="label"
                            value="critical"
                            checked={label === "critical"}
                            onChange={handleChange}
                        />
                        Critical
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="label"
                            value="urgent"
                            checked={label === "urgent"}
                            onChange={handleChange}
                        />
                        Urgent
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="label"
                            value="frontend"
                            checked={label === "frontend"}
                            onChange={handleChange}
                        />
                        Frontend
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="label"
                            value="backend"
                            checked={label === "backend"}
                            onChange={handleChange}
                        />
                        Backend
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="label"
                            value=""
                            checked={!label}
                            onChange={handleChange}
                        />
                        All
                    </label>
                </fieldset>
            </form>
        </section>
    )
}
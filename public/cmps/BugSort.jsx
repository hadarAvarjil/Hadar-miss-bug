const { useState, useEffect } = React

export function BugSort({ sortBy, onSetSortBy }) {

    const [sortByToEdit, setSortByToEdit] = useState({ ...sortBy })


    useEffect(() => {
        onSetSortBy(sortByToEdit)
    }, [sortByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.type === 'number' ? +target.value : target.value
        setSortByToEdit(prevSort => ({
            ...prevSort,
            [field]: field === 'desc' ? -prevSort.desc : value
        }))
    }

    return (
        <section className="bug-sort">
            <form className="bug-sort-form" onSubmit={(ev) => ev.preventDefault()}>
                <label htmlFor="sortByField">Sort By</label>
                <select
                    name="type"
                    id="sortByField"
                    value={sortByToEdit.type}
                    onChange={handleChange}
                >
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Date</option>
                </select>
                <label>
                    <input
                        type="checkbox"
                        name="desc"
                        checked={sortByToEdit.desc < 0}
                        onChange={handleChange}
                    />
                    Descending
                </label>
            </form>
        </section>
    )
}
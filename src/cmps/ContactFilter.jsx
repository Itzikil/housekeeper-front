import loader from '../assets/svg/loader.gif'

export const ContactFilter = ({filterBy}) => {

    state = {
        filterBy: null
    }

    // componentDidMount() {
    //     const { filterBy } = this.props
    //     this.setState({ filterBy: { ...filterBy } })
    // }

    const handleChange = ({ target }) => {
        const field = target.name
        let value = target.value

        this.setState(
            prevState => ({ filterBy: { ...prevState.filterBy, [field]: value } }),
            () => this.props.onChangeFilter({ ...this.state.filterBy })
        )
    }
    const { filterBy } = this.state
    if (!filterBy) return <img src={loader} alt="loading" width={100} />
    const { term } = filterBy

    return (
        <section>
            <form >
                <input type="text" name="term" value={term} onChange={handleChange} placeholder="Search" />
            </form>
        </section>
    )
}

import { useEffect, useState } from "react"
import { i18Service } from "../services/i18n-service"
import { itemService } from "../services/items-service"

export const Items = () => {

    const [openDev, setOpenDev] = useState(false)
    const [itemOpen, setItemOpen] = useState()
    const [items, setItems] = useState()
    const [showItems, setShowItems] = useState(false)
    const [depratmentOpen, setDepratmentOpen] = useState()
    const [departments, setDepartments] = useState(itemService.getDepartments())

    const [input1, setInput1] = useState('')
    const [input2, setInput2] = useState('')

    useEffect(() => {
        translate()
    }, [itemOpen])

    const openDepartment = (department) => {
        // if (depratmentOpen._id === department) setDepratmentOpen('')
        // else {
        setItems(itemService.getItemByDepartment(department.id))
        setDepratmentOpen(department)
        // }
        setShowItems(true)
    }

    const backToDepartments = () => {
        setDepratmentOpen('')
        setShowItems(false)
    }

    const translate = () => {
        i18Service.doTrans()
    }
    const toggleDev = () => {
        setOpenDev(!openDev)
    }

    const openItem = (itemId) => {
        itemOpen === itemId ? setItemOpen(false) : setItemOpen(itemId)
    }

    const onChangeFilter = ({ target }) => {
        let value = target.value
        let name = target.name
        if (name === 'department') {
            setShowItems(false)
            setDepartments(itemService.getDepartments(value))
            setInput1(value)
            setInput2('')
        } else {
            setItems(itemService.loadItems(value, depratmentOpen?.id))
            setShowItems(true)
            setInput2(value)
            setInput1('')
            if (!value) {
                setShowItems(false)
            }
        }
    }

    if (!items && !departments) return <div>Loading</div>
    return (
        <section className="items-container">
            <h2>{depratmentOpen ? <span data-trans="items">items</span> : <span data-trans="item groups">item groups</span>}</h2>
            {depratmentOpen && <h3>Results for <span className="bold"> {depratmentOpen.name}  ({depratmentOpen.id})</span> </h3>}
            {depratmentOpen && <button onClick={backToDepartments}>Back to department</button>}
            {!depratmentOpen && <input value={input1} type="text" onChange={onChangeFilter} name="department" className="input" placeholder="search department" />}
            <input value={input2} type="text" onChange={onChangeFilter} name="item" className="input" placeholder="search item" />
            {
                <ul className="items-list">
                    {!showItems ? departments.map((department) =>
                        <li key={department.id}>
                            <button onClick={() => openDepartment(department)}>{department.name}</button>
                        </li>
                    ) :
                        items.map((item) =>
                            <li key={item._id}>
                                <button onClick={() => openItem(item._id)}>{item.name}</button>
                                {(itemOpen === item._id) && <div>
                                    <p>Bar code - <span className="bold"> {item['bar-code']}</span></p>
                                </div>}
                            </li>
                        )
                    }
                </ul>
            }
            <button onClick={toggleDev}>{!openDev ? ' למפתחים' : 'סגור'}</button>
            {openDev && <pre>{JSON.stringify(items, null, 2)}</pre>}
        </section>
    )
}
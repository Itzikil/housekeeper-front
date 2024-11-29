import { useEffect, useState } from "react"
import { supplierService } from "../services/supplier-service"
import { AdditionForm } from "../cmps/AdditionForm"
import SearchBar from "../cmps/SearchBar"


export const Orders = ({ translate }) => {

    const [supplier, setSupplier] = useState()
    const [showOrder, setShowOrder] = useState()

    useEffect(() => {
        translate()
    }, [])

    const makeOrder = () => {
        showOrder ? setShowOrder(false) : setShowOrder(true)
    }

    const handleChange = ({ target }) => {
        let value = target.value
        setSupplier(value)
    }

    return (
        <section>
            <h1 data-trans="order">Order</h1>
            <SearchBar suggestions={supplierService.loadSuppliers()} handleChange={handleChange} name="supplier" />
            <button onClick={makeOrder}>Make order</button>
            {showOrder && <AdditionForm order={supplier} />}
        </section>
    )
}
import { useEffect, useState } from "react"
import { AdditionForm } from "../cmps/AdditionForm"
import { useParams } from "react-router-dom"

export const BillEdit = ({ translate }) => {
    const [editBill, setEditBill] = useState()
    const params = useParams()

    useEffect(() => {
        params.id ? setEditBill(true) : ''
    })

    return (
        <section className='bill-section'>
            <h2>{editBill ? 'Edit bill' : 'Add bill'}</h2>
            <AdditionForm />
        </section>
    )
}
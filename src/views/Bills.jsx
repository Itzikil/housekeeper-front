import { useEffect, useState } from 'react'
import { billService } from '../services/bill-service'
import { supplierService } from '../services/supplier-service'
import { itemService } from '../services/items-service'
import { i18Service } from '../services/i18n-service'
import { utilsService } from '../services/utils-service'
import { Link } from 'react-router-dom'

export const Bills = () => {

    const [billsAmount, setBillsAmount] = useState(0)
    const [bills, setBills] = useState(billService.loadBills())
    const [openDev, setOpenDev] = useState(false)
    const [itemOpen, setItemOpen] = useState()

    useEffect(() => {
        translate()
    }, [itemOpen])

    const loadMore = () => {
        var moreBills = billsAmount + 1
        setBillsAmount(moreBills)
        setBills(billService.loadBills('', moreBills))
    }

    const loadAll = () => {
        setBills(billService.loadBills('', 'all'))
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
        setBills(billService.loadBills(value))
    }

    var currSupplier
    var currItem
    return (
        <section className='bill-section'>
            <h2 data-trans="bills">bills</h2>
            <input type="text" onChange={onChangeFilter} className="input" placeholder='search supplier' />
            <Link to={`/bill/edit`}><p>Add new bill</p></Link>

            {/* <ul className="list"> */}
            <ul className="items-list">
                {bills.map(bill => {
                    { currSupplier = supplierService.getSupplierById(bill.supplier._id) }
                    return <li key={bill._id} className="bill-receiptes">
                        <div className='flex align-center gap10'>
                            <p>{utilsService.setDate(bill.date)}</p>
                            <button onClick={() => openItem(bill._id)}>{currSupplier?.name}</button>
                        </div>
                        {itemOpen === bill._id && <div className='bill-receipte'>
                            <div className='bill-head'>
                                <button onClick={() => openItem(bill._id)}>X</button>
                                <h3>{currSupplier.name}</h3>
                                <p>{utilsService.setDate(bill.date)}</p>
                                <Link to={`/bill/edit/${bill._id}`} >edit</Link>
                                <p><span data-trans="Reference number"> Reference number</span> {bill['reference-number']}</p>
                            </div>
                            <div className='bill-body'>
                                <div className='bill-table'>
                                    <p className='text-start bold' data-trans="Name">Name</p>
                                    <p className='text-end bold' data-trans="Total">Total</p>
                                    <p className='text-center bold' data-trans="Quantity">Quantity</p>
                                    <p className='text-center bold' data-trans="Price">Price</p>
                                </div>
                                {bill.items.map((item, idx) => {
                                    { currItem = itemService.getItemById(item._id) }
                                    return <div key={item._id + idx}>
                                        <div className='bill-table'>
                                            <p className='text-start'>{currItem?.name}</p>
                                            <p className='text-end'>₪{(item.price * item.quantity)?.toFixed(2)}</p>
                                            <p className='text-center'>{item.quantity % 1 === 0 ? (item.quantity) : item.quantity?.toFixed(2)}</p>
                                            {item.price && <p className='text-center'>₪{item.price.toFixed(2)}</p>}
                                        </div>
                                    </div>
                                })}
                            </div>
                            <div className='flex space-between'>
                                <h3 data-trans="Total">Total</h3>
                                <h3>₪{utilsService.priceSum(bill.items, true, bill)}</h3>
                            </div>
                        </div>}
                    </li>
                }
                )}
            </ul>
            <div className='flex align-center justify-center'>
                <button onClick={loadAll}>Load all</button>
                <button onClick={loadMore}>Load more</button>
            </div>
            <button onClick={toggleDev}>{!openDev ? ' למפתחים' : 'סגור'}</button>
            {openDev &&
                <pre >
                    {JSON.stringify(bills, null, 2)}
                </pre>
            }
        </section>
    )
}
import { useEffect, useRef, useState } from "react"
import { billService } from "../services/bill-service"
import { itemService } from "../services/items-service"
import { i18Service } from "../services/i18n-service"
import { utilsService } from "../services/utils-service"
import { supplierService } from "../services/supplier-service"
import { useParams } from "react-router-dom"
import SearchBar from "../cmps/SearchBar"

export const Summary = () => {
    const [currItems, setCurrItems] = useState()
    const [currFilteredItems, setCurrFilteredItems] = useState()
    const [productName, setProductName] = useState()

    const params = useParams()
    const inputRefs = useRef([]);

    useEffect(() => {
        translate()
        loadItem()
    }, [])

    const translate = () => {
        i18Service.doTrans()
    }

    const ClearChart = () => {
        setCurrFilteredItems('')
        setCurrItems('')
        setProductName('')
        inputRefs.current.forEach((inputRef) => {
            if (inputRef) inputRef.value = ''
        });
    }

    function loadItem() {
        var itemId = params.id
        if (itemId) {
            var setItem = billService.getItemSummary(itemId)
            setCurrItems(setItem)
            var item = itemService.getItemById(itemId)
            setProductName(item?.name)
            setCurrFilteredItems(setItem)
        }
    }

    const handleChange = ({ target }) => {
        let value = target.value
        const field = target.name

        if (!value) return
        if (field === "name") {
            var setItem = billService.getItemSummary(value['bar-code'])
            setCurrItems(setItem)
        } else if (field === "group") {
            var setItem = billService.getItemSummary(null, value._id)
            setCurrItems(setItem)
        } else if (field === "item-groups") {
            var setItem = billService.getItemSummary(value.id, 'department')
            setCurrItems(setItem)
        } else if (field === "supplier") {
            var setItem = billService.getItemSummary(value._id, 'supplier')
            setCurrItems(setItem)
        } else {
            var setItem = billService.filterByDays(currItems, value)
        }
        if (value.name) setProductName(value.name)
        setCurrFilteredItems(setItem)
    }

    return (
        <section className="summary-section">
            <h2 data-trans="summary">Summary</h2>
            <select onChange={handleChange} name="date" className="input">
                <option value="9999999">Anytime</option>
                <option value="7">1 week ago</option>
                <option value="30">1 month ago</option>
                <option value="90">3 month ago</option>
                <option value="180">6 month ago</option>
                <option value="365">1 year ago</option>
            </select>
            <form >
                <SearchBar suggestions={itemService.getDepartments()} handleChange={handleChange} name="item-groups" placeholder={'item-group'} />
                <SearchBar suggestions={itemService.loadItems()} handleChange={handleChange} name="name" placeholder={'item'} />
                <SearchBar suggestions={billService.loadGroups()} handleChange={handleChange} name="group" placeholder={'supplier-group'} />
                <SearchBar suggestions={supplierService.loadSuppliers()} handleChange={handleChange} name="supplier" placeholder={'supplier'} />
            </form>
            {currFilteredItems && (currFilteredItems?.length) ?
                <div className="flex space-between align-center">
                    <h3><span data-trans="Total">Total</span> : {utilsService.priceSum(currFilteredItems, true)} <span data-trans="On"> On </span> '{productName}'</h3>
                    <button onClick={ClearChart}>Clear</button>
                </div>
                : <h3>Didnt bought that product yet</h3>}
            {currFilteredItems && <div>
                <div className='flex space-between flex1 align-center justify-center gap20'>
                    <p className='text-start bold' data-trans="Date">Date</p>
                    <p className='text-start bold' data-trans="Name">Name</p>
                    <p className='text-start bold' data-trans="Supplier">Supplier</p>
                    <p className='text-start bold' data-trans="RN">RN</p>
                    <p className='text-start bold' data-trans="Price">Price</p>
                    <p className='text-start bold' data-trans="Quantity">Quantity</p>
                    <p className='text-start bold' data-trans="Total">Total</p>
                </div>
                {currFilteredItems?.map((item, idx) =>
                    <div key={idx + item._id}>
                        <div className='flex space-between flex1 align-center justify-center gap20 '>
                            <p className='text-start'>{utilsService.setDate(item.date)}</p>
                            <p className='text-start'>  {item.name}</p>
                            <p className='text-start'>  {item.supplier.name}</p>
                            <p className='text-start'>  {item['reference-number']}</p>
                            {item.price && <p className='text-start'>₪{item.price.toFixed(2)}</p>}
                            <p className='text-start'>{item.quantity % 1 === 0 ? (item.quantity) : item.quantity?.toFixed(3)}</p>
                            <p className='text-start'>₪{(item.price * item.quantity)?.toFixed(2)}</p>
                        </div>
                    </div>
                )}
            </div>}
        </section >
    )
}

////use the ref for cleaning input


{/* <input type="text" list="item-groups" name="item-groups" onChange={handleChange} placeholder="Choose item group" className="input" ref={(ref) => (inputRefs.current[0] = ref)} />
                <datalist id="item-groups">
                {itemService.getDepartments().map(department =>
                    <option value={department.id} key={department.id}>{department.name}</option>
                    )}
                </datalist> */}

{/* <input type="text" list="items" name="name" onChange={handleChange} placeholder="Choose item" className="input" ref={(ref) => inputRefs.current[1] = ref} />
                <datalist id="items">
                    {itemService.loadItems().map(item =>
                        <option value={item["bar-code"]} name={item.name} key={item._id} style={{ color: 'transparent' }}>{item.name}</option>
                    )}
                </datalist> */}
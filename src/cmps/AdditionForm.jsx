import { useEffect, useState } from "react"
import { billService } from "../services/bill-service"
import { itemService } from "../services/items-service"
import { supplierService } from "../services/supplier-service"
import { utilsService } from "../services/utils-service"
import { useNavigate, useParams } from "react-router-dom"
import { useMessagePopup } from "./UserMessage"
import SearchBar from "./SearchBar"


export const AdditionForm = ({ order }) => {

    const [form, setForm] = useState()
    const [lastPurchase, setLastPurchase] = useState('')
    const [itemsLine, setItemsLine] = useState(billService.getItemsLine())
    const [showMessage, MessagePopup] = useMessagePopup();
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!params.id && !order) setForm(billService.getEmptyBill())
        else loadBill()
    }, [])

    const loadBill = () => {
        var billId = params.id
        if (billId) {
            var bill = billService.getBillById(billId)
            setForm(bill)
            setItemsLine(bill.items)
        } else if (order) {
            // var newForm = form
            // newForm.supplier._id = order
            // setForm(newForm)
            let oldForm = billService.getEmptyBill()
            oldForm.supplier = { _id: order._id, name: order.name, 'group-code': order['group-code'] }
            setForm(oldForm)
            setItemsLine(billService.get3LastBills(order._id))
        }
    }

    const onSaveForm = (ev) => {
        ev.preventDefault()
        var errorMsg = utilsService.formCheck(form, itemsLine)
        if (errorMsg) return handleError(errorMsg)
        form.date = utilsService.transformYear(form.date)
        form.items = itemsLine.filter(line => line._id)
        // const date = utilsService.transformYear(form.date)
        // const items = itemsLine.filter(line => line._id)
        // setForm(prevForm => ({ ...prevForm, date, items }))
        billService.saveBill(form)
        setTimeout(() => navigate('/bills'), 1100)
        handleSuccess('Bill saved')
    }

    const addItemLine = () => {
        const line = billService.getItemsLine()
        setItemsLine([...itemsLine, ...line])
    }

    // const removeItemLine = (idx) => {
    //     var lines = [...itemsLine]
    //     lines.splice(idx, 1)
    //     setItemsLine(lines)
    // }

    const removeItemLine = (idx) => {
        setItemsLine((prevItemsLine) => {
            const updatedItemsLine = [...prevItemsLine];
            updatedItemsLine.splice(idx, 1);
            return updatedItemsLine;
        });
    };

    const closeLastPurchase = () => {
        setLastPurchase('')
    }

    const handleChange = ({ target }, idx) => {
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
            default:
                break;
        }
        if (idx || idx === 0) {
            let lines = itemsLine
            if (field === '_id') {
                lines[idx]['name'] = value.name
                value = value['bar-code']
            }
            lines[idx][field] = value
            setItemsLine(lines);
            var last3 = { array: billService.lastThreePurchases(value), lineIdx: idx }
            if (last3) { setLastPurchase(last3) }
            if (field === '_id' && form.supplier._id && !itemsLine[idx]['price']) {
                var item = billService.lastItemFromSupplier(value, form.supplier._id)
                if (!item) return
                itemsLine[idx]['price'] = item.price
                itemsLine[idx]['quantity'] = item.quantity
            }
        }
        else if (field === 'supplier') {
            form.supplier = { _id: value._id, name: value.name, 'group-code': value['group-code'] }
            // value = { _id: supplier._id, name: supplier.name, 'group-code': supplier['group-code'] }
        }
        else form[field] = value

        setForm(form => ({ ...form }))
    }

    const handleSuccess = (msg) => {
        showMessage(msg, true);
    }

    const handleError = (msg) => {
        showMessage(msg, false);
    };

    if (!form) return <h2 className="text-center">loading</h2>

    return (
        <div className="additionForm">
            <MessagePopup />
            <form onSubmit={onSaveForm} >
                <div className="input-container">
                    <SearchBar suggestions={supplierService.loadSuppliers()} handleChange={handleChange} name="supplier" value={{ name: form.supplier?.name, _id: form.supplier?._id }} />
                    <input type="date" onChange={handleChange} value={form.date} name="date" className="input" placeholder="dd/mm/yyyy" />
                    <input type="text" onChange={handleChange} value={form['reference-number']} name="reference-number" placeholder="Reference number" className="input" />
                    <input type="number" onChange={handleChange} value={form.total || ''} name="total" placeholder="Total" className="input" />
                </div>
                <label>Items</label>
                <div className="line-container flex column gap20">

                    {itemsLine?.map((item, idx) =>
                        <div className="flex gap10 relative" key={idx + item._id}>
                            {lastPurchase && lastPurchase.array[0] && (lastPurchase.lineIdx === idx) && <div className="lastPurchases">
                                <div className="flex space-between">
                                    <button onClick={closeLastPurchase}>X</button>
                                </div>
                                {lastPurchase.array.map((purchase, idx) =>
                                    <div className="flex gap20 space-between" key={purchase._id + idx}>
                                        <p>{purchase.supplier}</p>
                                        <p>{purchase.date}</p>
                                        <p>₪{purchase.price}</p>
                                    </div>
                                )}
                            </div>}
                            <button type="button" onClick={() => removeItemLine(idx)} className="input">X</button>
                            <SearchBar suggestions={itemService.loadItems()} handleChange={handleChange} name="_id" value={{ name: item?.name, _id: item?.["bar-code"] }} idx={idx} />
                            {/* <input type="text" onChange={(ev) => handleChange(ev, idx)} list="items" value={item._id} name="_id" className="input select-item" placeholder="item" />
                            <datalist id="items">
                                {itemService.loadItems().map((item, idx) =>
                                    <option key={item._id + idx} value={item["bar-code"]}>{item.name}</option>
                                )}
                            </datalist> */}
                            <p>₪{((item.quantity * item.price) - (item.discount || 0)).toFixed(2)}</p>
                            <input type="number" onChange={(ev) => handleChange(ev, idx)} value={item.quantity} name="quantity" placeholder="Quantity" className="input" />
                            <input type="number" onChange={(ev) => handleChange(ev, idx)} value={item.price} name="price" placeholder="Price per 1" className="input" />
                            <input type="number" onChange={(ev) => handleChange(ev, idx)} value={item.discount} name="discount" placeholder="discount" className="input" />
                        </div>
                    )}
                </div>
                <div className="flex gap20 align-center">
                    <button type="button" onClick={addItemLine}>Add more item</button>
                    <div>
                        <input type="number" onChange={(ev) => handleChange(ev)} value={form.discount} name="discount" placeholder="total discount" className="input" />
                    </div>
                </div>
                <h3 className="align-end" >Total ₪{utilsService.priceSum(itemsLine, true, form)}</h3>
                <button className="btn">Submit</button>
            </form>
        </div>
    )
}
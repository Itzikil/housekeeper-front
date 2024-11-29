import { useEffect, useState } from "react"
import { i18Service } from "../services/i18n-service"
import { supplierService } from "../services/supplier-service"
import { billService } from "../services/bill-service"
import { Link } from "react-router-dom"
import { itemService } from "../services/items-service"
import { utilsService } from "../services/utils-service"

export const Assemblage = () => {
    useEffect(() => {
        translate()
    }, [])

    const translate = () => {
        i18Service.doTrans()
    }

    const [suppliers, setSuppliers] = useState(supplierService.loadSuppliers())
    const [groups, setGroups] = useState(itemService.getDepartments())
    const [showSuppliers, setShowSuppliers] = useState(false)
    const [currGroup, setCurrGroup] = useState();
    const [viewMode, setViewMode] = useState('items');
    const [currSupplier, setCurrSupplier] = useState();
    const [supplierItems, setSupplierItems] = useState();

    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    const openSuppliers = (group) => {
        setCurrGroup(group)
        if (group.id) {
            setShowSuppliers(group.id)
            return setSuppliers(itemService.getItemByDepartment(group.id))
        }
        setShowSuppliers(group._id)
        setSuppliers(supplierService.getSupplierByGroup(group._id))
    }

    const backToGroups = () => {
        setShowSuppliers('')
        setSupplierItems('')
        setCurrGroup('')
        setInput2('')
    }

    const getSupllierItems = (supplierId) => {
        var supplierBill = billService.getItemSummary(supplierId, 'supplier')
        const uniqueObjects = supplierBill.filter(
            (obj, index, self) => index === self.findIndex((o) => o.name === obj.name)
        );
        // supplierBill = billService.filterByDays(supplierBill, billsDate)
        setCurrSupplier(supplierBill)
        setSupplierItems(uniqueObjects)
    }

    const supplierSum = (itemId, supplierId) => {
        var supplierBills = viewMode === 'items' ? billService.getItemSummary(itemId) : billService.getItemSummary(itemId, (!supplierId ? 'supplier' : 'supplier-items'), supplierId)
        var sum = utilsService.priceSum(supplierBills)
        return !sum ? '' : utilsService.toLocal(sum)
    }

    const groupSum = (itemId) => {
        var supplierBills = viewMode === 'items' ? billService.getItemSummary(itemId, 'department') : billService.getItemSummary(null, itemId)
        var sum = utilsService.priceSum(supplierBills)
        return !sum ? '' : utilsService.toLocal(sum)
    }

    const onChangeFilter = ({ target }) => {
        let value = target.value
        let name = target.name
        if (name === 'group') {
            if (viewMode === 'items') {
                setGroups(itemService.getDepartments(value))
            } else {
                setGroups(supplierService.loadGroups(value))
            }
            setShowSuppliers(false)
            setInput1(value)
            setInput2('')
        } else if (name === 'date') {
            // setBillsDate(value)
        } else {
            if (!value) {
                if (currGroup) {
                    setSuppliers(supplierService.getSupplierByGroup(currGroup._id))
                } else {
                    backToGroups()
                }
                setInput2('')
            } else {
                if (viewMode === 'items') {
                    setSuppliers(itemService.loadItems(value))
                } else {
                    setGroups(supplierService.loadGroups())
                    setSuppliers(supplierService.loadSuppliers(value, currGroup?._id))
                }
                setShowSuppliers(true)
                setInput2(value)
                setInput1('')
            }
        }
    }
    const togglePage = () => {
        if (viewMode === 'items') {
            setViewMode('suppliers')
            setGroups(supplierService.loadGroups())
        } else {
            setGroups(itemService.getDepartments())
            setViewMode('items')
        }
        backToGroups()
    }

    // if (!suppliers) return <div>Loading</div>
    return (
        <section className="assemblage-container">
            <h2>assemblage</h2>
            <button onClick={togglePage}>{viewMode === 'items' ? 'Show suppliers' : 'Show items'}</button>
            {showSuppliers && currGroup && <h3>Results for <span className="bold"> {currGroup.name} ({currGroup._id || currGroup.id})</span> </h3>}
            <select onChange={onChangeFilter} name="date" className="input">
                <option value="9999999">Anytime</option>
                <option value="7">1 week ago</option>
                <option value="30">1 month ago</option>
                <option value="90">3 month ago</option>
                <option value="180">6 month ago</option>
                <option value="365">1 year ago</option>
            </select>
            {!showSuppliers && <input type="text" name="group" value={input1} onChange={onChangeFilter} className="input" placeholder={viewMode === 'items' ? "find items group" : "find  suppliers group"} />}
            <input type="text" name="supplier" value={input2} onChange={onChangeFilter} className="input" placeholder={viewMode === 'items' ? "find item" : "find supplier"} />
            {showSuppliers && <button onClick={backToGroups}>Back to groups</button>}
            <ul className="items-list">
                {!showSuppliers ? groups.map((group) => {
                    return groupSum((group.id || group._id)) &&
                        <li key={group._id || group.id}>
                            <div className="supplier-container">
                                <button onClick={() => openSuppliers(group)}>{group.name}</button>
                                <p>{groupSum((group.id || group._id))}</p>
                            </div>
                        </li>
                }
                ) :
                    (!supplierItems ? suppliers : supplierItems)?.map((item) => {
                        return (supplierItems ? supplierSum(item._id, item.supplier._id) : supplierSum(item['bar-code'] || item._id)) && <li key={item._id}>
                            <div className="supplier-container">
                                {(supplierItems || viewMode === 'items') ?
                                    <Link to={`/summary/${item['bar-code'] || item._id}`}>{item.name}</Link>
                                    : <button onClick={() => getSupllierItems(item._id)}>{item.name}</button>
                                }
                                <p>{(supplierItems ? supplierSum(item._id, item.supplier._id) : supplierSum(item['bar-code'] || item._id))}</p>
                            </div>
                        </li>
                    }
                    )}
            </ul>
        </section>
    )
}
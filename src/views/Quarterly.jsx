import { useEffect, useState } from "react"
import { itemService } from "../services/items-service"
import { billService } from "../services/bill-service"
import { utilsService } from "../services/utils-service"
import { Link } from "react-router-dom"

export const Quarterly = ({ translate }) => {

    const [departments, setDepartments] = useState(itemService.getDepartments())
    const [itemsDisplay, setItemsDisplay] = useState(false)
    const [twoYearMonth, setTwoYearMonth] = useState(billService.getLast24Months())
    const [showPopup, setShowPopup] = useState(false)

    useEffect(() => {
        translate()
    }, [])

    const openPopoup = (id) => {
        showPopup === id ? setShowPopup('') : setShowPopup(id)
    }

    const backToDeparments = () => {
        // console.log( billService.getItemSummary(departments[1]._id));
        // console.log(departments);
        setDepartments(itemService.getDepartments())
        setItemsDisplay(false)
    }

    const showItems = (department) => {
        setDepartments(itemService.getItemByDepartment(department))
        setItemsDisplay(true)
    }

    const getDepartmentSum = (departmentId, idx, oneMonth) => {
        var sum = itemsDisplay ? billService.getItemSummary(departmentId) : billService.getItemSummary(departmentId, 'department')
        var newSum = billService.groupByThreeMonths(sum)
        if ((idx === 0 || idx) && !newSum[idx]) return 0
        if (!idx && idx !== 0) {
            const sum = newSum.reduce((total, subArray, idx) => {
                if (idx >= twoYearMonth.length - 1) return total
                const subTotal = utilsService.priceSum(subArray)
                return total + subTotal;
            }, 0);
            if (!sum) return 0
            return utilsService.toLocal(sum)
        }
        var total = oneMonth ? billService.splitMonthes(newSum[idx])[oneMonth - 1] : newSum[idx]
        if (!total) return 0
        return utilsService.priceSum(total, true)
    }

    return (
        <section className="quarterly-section">
            <h1 data-trans="Quarterly">Quarterly</h1>
            {itemsDisplay && <button onClick={backToDeparments}>Back to deparments</button>}
            <ul className="">
                {departments.map((department, departmentIdx) => {
                    return ((itemsDisplay && getDepartmentSum(department['bar-code']) !== 0) || (!itemsDisplay && getDepartmentSum(department.id) !== 0) || departmentIdx === 0) && <li key={department.id} className="flex align-center space-between">
                        <div className="flex align-center space-between">
                            {!itemsDisplay ? <button onClick={() => showItems(department.id)}>{department.name}</button>
                                : <Link to={`/summary/${department['bar-code']}`} className="button">{department.name}</Link>}
                            <p>{getDepartmentSum(itemsDisplay ? department['bar-code'] : department.id) || '-'}</p>
                        </div>
                        <div className="flex gap20 relative quarterly-row">
                            {twoYearMonth.map((monthGroup, idx) =>
                                <div key={monthGroup[0].year + monthGroup[0].number} className="flex column">
                                    {departmentIdx === 0 && <p className="bold text-center">
                                        {monthGroup[0].number}.{monthGroup[0].year % 100} - {monthGroup[2].number}.{monthGroup[0].year % 100}
                                    </p>}
                                    {(showPopup === (monthGroup[0].year + '' + idx + (itemsDisplay ? department['bar-code'] : department.id))) && <div className="popup" onClick={() => openPopoup((monthGroup[0].year + '' + idx + (itemsDisplay ? department['bar-code'] : department.id)))}>
                                        <p className="text-center bold">{department.name}</p>
                                        <div className="flex gap20">
                                            <p>{monthGroup[0].month} - {getDepartmentSum((itemsDisplay ? department['bar-code'] : department.id), idx, 1)}</p>
                                            <p>{monthGroup[1].month} - {getDepartmentSum((itemsDisplay ? department['bar-code'] : department.id), idx, 2)}</p>
                                            <p>{monthGroup[2].month} - {getDepartmentSum((itemsDisplay ? department['bar-code'] : department.id), idx, 3)}</p>
                                        </div>
                                    </div>}
                                    <p className="text-center" onClick={() => openPopoup((monthGroup[0].year + '' + idx + (itemsDisplay ? department['bar-code'] : department.id)))}>{getDepartmentSum((itemsDisplay ? department['bar-code'] : department.id), idx) || '-'}</p>
                                </div>
                            )}
                        </div>
                    </li>
                }
                )}
            </ul>
        </section>
    )
}
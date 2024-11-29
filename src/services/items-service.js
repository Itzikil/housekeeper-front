export const itemService = {
    loadItems,
    getItemById,
    getDepartments,
    getItemByDepartment
}
import demoItems from '../data/item.json'

function loadItems(filterBy, department) {
    if (filterBy) {
        var items = demoItems.filter(item => item.name.toLocaleLowerCase().includes(filterBy))
        if (department) {
            items = getItemByDepartment(department, items)
        }
        return sort(items)
    } else if (!filterBy && department) {
        return getItemByDepartment(department)
    }
    return sort(demoItems)
}

function getItemById(itemId) {
    return demoItems.filter(item => itemId === item['bar-code'])[0]
}

function getItemByDepartment(departmentId, itemsArray = demoItems) {
    return sort(itemsArray.filter(item => departmentId === item['department']))
}

function sort(arr) {
    return arr.sort((a, b) => {
        if (a.id) {
            return +a.id.toLocaleLowerCase() < +b.id.toLocaleLowerCase() ? -1 : 1
        } else {
            return a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1
        }
    })
}

function getDepartments(filterBy) {
    var departments = []
    demoItems.forEach(item => {
        if (!item['department-name']) return
        const existingObject = departments.find(department => item['department-name'] === department.name)
        if (!existingObject) {
            departments.push({ name: item['department-name'], id: item['department'] })
        }
    })
    if (filterBy) {
        var filteredDepartments = departments.filter(department => department.name.toLocaleLowerCase().includes(filterBy))
        return sort(filteredDepartments)
    }
    return sort(departments)
}


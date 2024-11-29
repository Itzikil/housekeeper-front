export const supplierService = {
    loadSuppliers,
    getSupplierById,
    getSupplierByName,
    loadGroups,
    getSupplierByGroup
}

import demoSuppliers from '../data/supplier.json'
import groups from '../data/groups.json'

function loadGroups(filterBy) {
    // var groups = []
    // demoSuppliers.forEach(supplier => {
    //     const existingObject = groups.find(group => group.code === supplier['group-code']);

    //     if (!existingObject) {
    //         groups.push({ name: supplier['group-name'], code: supplier['group-code'] });
    //     }
    // });
    if (filterBy) {
        var filteredgroups = groups.filter(group => group.name.toLocaleLowerCase().includes(filterBy))
        return sort(filteredgroups)
    }
    return sort(groups, 'by id')
}

function loadSuppliers(filterBy, groupCode) {
    if (filterBy) {
        var suppliers = demoSuppliers.filter(supplier => supplier.name.toLocaleLowerCase().includes(filterBy))
        if (groupCode) {
            suppliers = getSupplierByGroup(groupCode, suppliers)
        }
        return sort(suppliers)
    }
    return sort(demoSuppliers)
}

function getSupplierById(supplierId) {
    return demoSuppliers.filter(supplier => supplierId === supplier._id)[0]
}

function getSupplierByName(supplierName) {
    return demoSuppliers.filter(supplier => supplier.name.toLocaleLowerCase().includes(supplierName))
}

function getSupplierByGroup(supplierGroup, suppliers = demoSuppliers) {
    var filteredArr = suppliers.filter(supplier => supplier['group-code'].toLocaleLowerCase().includes(supplierGroup))
    return filteredArr
    ////sort???
}

function sort(arr, byId) {
    return arr.sort((a, b) => {
        if (byId) {
            return +a._id < +b._id ? -1 : 1
        } else {
            return a.name < b.name ? -1 : 1
        }
    })
}
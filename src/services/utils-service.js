export const utilsService = {
    setDate,
    transformYear,
    checkIfEqual,
    formCheck,
    priceSum,
    toLocal
}

function setDate(inputDate) {
    const dateParts = inputDate.split("-");
    const year = dateParts[0].slice(-2); // Extract the last two digits of the year
    const month = dateParts[1];
    const day = dateParts[2];
    return `${day}.${month}.${year}`;
}

function transformYear(date) {
    let dateParts = date.split('-');
    let year = dateParts[0];

    if (year.startsWith('00')) {
        year = '20' + year.substring(2);
        dateParts[0] = year;
        return dateParts.join('-');
    } else {
        return date;
    }
}

function checkIfEqual(form, lines) {
    var total = lines.reduce((acc, item) => acc + ((item.quantity * item.price) - (item.discount || 0)), 0) - (form.discount || 0)
    return (((+form.total - +total) <= 1) && (+form.total - +total >= -1))
}

function formCheck(form, lines) {
    var msg
    lines.forEach(line => {
        if (!line._id && (line.price || line.quantity)) msg = 'half empty line'
    })
    if (!form.supplier._id) msg = 'Supplier requierd'
    else if (!checkIfEqual(form, lines)) msg = 'Total not equal!'
    else if (!form.date) msg = 'date requierd'
    else if (!form["reference-number"]) msg = 'reference number requierd'
    return msg
}

function toLocal(array) {
    return array?.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })
}

function priceSum(array, local, bill) {
    var sum = array?.reduce((acc, item) => acc + ((item.price * item.quantity) - (item?.discount || 0)), 0) - (bill?.discount || 0)
    return local ? toLocal(sum) : sum
}
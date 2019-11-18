const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async() => {
    const doc = new GoogleSpreadsheet ('1m9_Ig_MRNWo4kQhMjleOjz0Wj5sqQu6fsIUT7x_XRDM')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({name: request.body.name, store: request.body.store, day: request.body.day, product: request.body.product, brand: request.body.brand, size: request.body.size, receivedOutput: request.body.receivedOutput })
}
addRowToSheet()

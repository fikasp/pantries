import * as models from '../models/models.js'
const path = './models/data.json'

export async function createRecord(req, res) {
  try {
    const value = req.body.value
    const data = await models.read(path)
    const newID = models.getMaxId(data) + 1
    const newData = [...data, { id: newID, value, done: false }]

    await models.write(path, newData)

    console.log(`Record ${newID} added...`)
    res.json(newData)
  } catch (err) {
    next(err)
  }
}

export async function readRecords(req, res, next) {
  try {
    const data = await models.read(path)
    res.json(data)
    console.log(data)
  } catch (err) {
    next(err)
  }
}

export async function readRecord(req, res, next) {
  const { id } = req.params
  try {
    const data = await models.read(path)
    const record = data.find(record => record.id === Number(id))
    if (!record) {
      const error = new Error(`Record ${id} does not exist...`)
      error.status = 404
      throw error
    }
    res.json(record)
    console.log(record)
  } catch (err) {
    next(err)
  }
}

export async function updateRecord(req, res, next) {
  const { id } = req.params
  const updatedObj = req.body
  try {
    const data = await models.read(path)
    const updatedData = [...data]
    const recordIndex = updatedData.findIndex(record => record.id === Number(id))
    updatedData[recordIndex] = { ...updatedData[recordIndex], ...updatedObj }
    await models.write(path, updatedData)
    res.json(updatedData)

    console.log(`Record ${id} updated...`)
    console.log(updatedData[recordIndex])
  } catch (err) {
    next(err)
  }
}

export async function deleteRecord(req, res) {
  const { id } = req.params
  try {
    const data = await models.read(path)
    const filteredData = data.filter(record => record.id !== Number(id))

    await models.write(path, filteredData)
    res.json(filteredData)

    console.log(`Record ${id} deleted...`)
  } catch (err) {
    next(err)
  }
}



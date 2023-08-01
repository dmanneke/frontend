import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (person) => {
    const promise = axios.post(baseUrl, person)
    return promise.then(repsonse => repsonse.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, personsObj) => {
    const promise = axios.put(`${baseUrl}/${id}`, personsObj)
    return promise.then(response => response.data)
}

export default {getAll, create, remove, update}
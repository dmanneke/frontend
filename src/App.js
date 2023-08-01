import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({message}) => {
  const notificationStyle = {
      color: 'black',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
  }

  if (message === null) {
      return null
  } 
  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const Filter = ({newSearch, handleSearch}) => {
  return (
  <form>
    filter numbers with substring: <input value={newSearch} onChange={handleSearch}/>
  </form>
  )
}

const PersonForm = (props) => {
  return (
      <form onSubmit={props.handleSubmit}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange}/>
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.hanldeNumberchange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, setPersons, toShow, setToShow, setNewSearch, setErrorMessage}) => {

  const handleRemoveOf = (id) => {
    if (window.confirm(`Are you sure you want to delete [${persons.filter(person => person.id === id)[0].name}]`)) {
      personService.remove(id)
      .catch(error => console.log(error))

      const remainingPersons = persons.filter(person => person.id !== id)
      setPersons(remainingPersons)
      setToShow(remainingPersons)
      setNewSearch('')
      setErrorMessage('Person is deleted!')
      setTimeout(() => {setErrorMessage(null)}, 5000)
    }
  }

  return (
    <ul>
      {toShow.map(person => 
        <li 
          key={person.name}>{person.name} {person.number}
          <button onClick={() => handleRemoveOf(person.id)}>Delete</button>
        </li>
        )}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [toShow, setToShow] = useState(persons)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
    .then(persons => {
      setPersons(persons)
      setToShow(persons)
    })
  }, [])


  const handleSubmit = (event) => {
    event.preventDefault()
    const namesArray = persons.map(person => person.name)

    if (namesArray.find(name => name === newName)) {
      if (window.confirm(`${newName} is already in the phonebook, do you want to replace the number?`)) {
        const personToUpdate = persons.filter(person => person.name === newName)[0]

        const updatedPerson = { ...personToUpdate, number: newNumber}
        
        if (!newNumber) {
          setErrorMessage(`Cannot replace number with empty string.`)
          personService.update(personToUpdate.id, {...personToUpdate, number: ''})
          .catch(error => setErrorMessage(`Cannot replace number with empty string.`))
        } else {
          personService.update(personToUpdate.id, updatedPerson)
          .catch(error => setErrorMessage(`${personToUpdate.name} has already been removed from server.`))
  
          // create copy of the persons state with the person to replaced
          const updatedPersons = persons.map(person => person.name !== personToUpdate.name ? person : updatedPerson)
          setPersons(updatedPersons)
          setToShow(updatedPersons)
          setErrorMessage('Number is changed!')
          setTimeout(() => {setErrorMessage(null)}, 5000)
        }
      }
    } else {
      const personsObj = {name: newName, number: newNumber}
      personService.create(personsObj)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson)) 
        setToShow(toShow.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNewSearch('')
        setErrorMessage('Person is added!')
        setTimeout(() => {setErrorMessage(null)}, 5000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
      })
    }
  } 
  

  const handleSearch = (event) => {
    const substring = event.target.value.toLowerCase()
    setNewSearch(substring)
    const filtered = persons.filter(person => person.name.toLowerCase().includes(substring))
    setToShow(filtered)
  }
  
  if (!persons) {
    return null
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />

      <Filter value={newSearch} handleSearch={handleSearch} />

      <h2>Add a new</h2>
      <PersonForm 
        handleSubmit={handleSubmit}
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={ (event) => setNewName(event.target.value) }
        hanldeNumberchange={ (event) => setNewNumber(event.target.value) }
      />

      <h2>Numbers</h2>
      <Persons 
        persons={persons}
        setPersons={setPersons} 
        toShow={toShow} 
        setToShow={setToShow} 
        setNewSearch={setNewSearch}
        setErrorMessage={setErrorMessage}
      />
    </div>
  )
}

export default App
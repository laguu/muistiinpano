import './index.css'
import React from 'react'
import Note from './components/Note'
import noteService from './services/notes'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [
        {
          id: 1,
          content: 'HTML on helppoa',
          date: '2017-12-10T17:30:31.098Z',
          important: true
        },
        {
          id: 2,
          content: 'Selain pystyy suorittamaan vain javascriptiä',
          date: '2017-12-10T18:39:34.091Z',
          important: false
        },
        {
          id: 3,
          content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
          date: '2017-12-10T19:20:14.298Z',
          important: true
        }
      ],
      newNote: '',
      showAll: true,
      error: null
    }
    console.log('constructor')

  }

  toggleImportanceOf = (id) => {
    return () => {
      //const url = `http://localhost:3001/notes/${id}`
      const note = this.state.notes.find(n => n.id === id)
      const changedNote = { ...note, important: !note.important }

      noteService
        .update(id, changedNote)
        .then(changedNote => {
          const notes = this.state.notes.filter(n => n.id !== id)
          this.setState({
            notes: notes.concat(changedNote)
          })
        })
        .catch(error => {
          this.setState({
            error: `muistiinpano ${note.content} on jo valitettavasti poistettu palvelimelta`,
            notes: this.state.notes.filter(n => n.id !== id) 
          })
          setTimeout(() => {
            this.setState({error: null})
          }, 5000)
        })
    }
  }

  componentDidMount() {
    console.log("did mount")
    noteService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        this.setState({ notes: response })
      })

  }

  addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: this.state.newNote,
      date: new Date(),
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
      .then(newNote => {
        this.setState({
          notes: this.state.notes.concat(newNote),
          newNote: ''
        })
      })
  }

  handleNoteChange = (event) => {
    console.log(event.target.value)
    this.setState({ newNote: event.target.value })
  }

  toggleVisible = () => {
    this.setState({ showAll: !this.state.showAll })
  }

  render() {
    console.log('render')
    const notesToShow =
      this.state.showAll ?
        this.state.notes :
        this.state.notes.filter(note => note.important === true)

    const label = this.state.showAll ? 'vain tärkeät' : 'kaikki'


    return (
      <div>
        <h1>Muistiinpanot</h1>
        <Notification message={this.state.error} />

        <div>
          <button onClick={this.toggleVisible}>
            näytä {label}
          </button>
        </div>

        <ul>
          {notesToShow.map(note =>
            <Note
              key={note.id}
              note={note}
              toggleImportance={this.toggleImportanceOf(note.id)}
            />)}
        </ul>
        <form onSubmit={this.addNote}>
          <input
            value={this.state.newNote}
            onChange={this.handleNoteChange}
          />
          <button type="submit">tallenna</button>
        </form>
      </div>
    )
  }
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}

export default App


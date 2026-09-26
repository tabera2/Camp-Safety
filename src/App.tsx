//import { useState } from 'react'
import QuestionCard from './components/QuestionCard'
import {questions} from "./data/questions";
import './App.css'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <main>
      <h1> Camp Safety</h1>

      <QuestionCard question={questions[2]} />
    </main>
  )
}

export default App

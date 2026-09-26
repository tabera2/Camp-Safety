import { use, useState } from 'react'
import QuestionCard from './components/QuestionCard'
import {questions} from "./data/questions";
import type { Answer } from './types/assessment';
import './App.css'

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isComplete, setIsComplete] = useState(false)

  function handleAnswer(answer: string) {
    const newAnswer: Answer = {
      questionId: questions[currentQuestion].id,
      answer: answer,
    };
    
    setAnswers([...answers, newAnswer])
    if (currentQuestion < questions.length - 1){
      setCurrentQuestion(currentQuestion + 1);
    }else{
      setIsComplete(true);
    }
  }

    //console.log(answers)

    const progress = ((currentQuestion + 1) / questions.length) * 100;
  return (
    <main>
      <h1> Camp Safety</h1>

      {isComplete ? (
        <section>
          <h2>Assessment Complete</h2>
          <p>Your responses have been recorded.</p>
        </section> 
      ): ( 


      <QuestionCard 
      question={questions[currentQuestion]}
      onAnswer={handleAnswer}
      />
      )}
      
      <p> Question {currentQuestion + 1} of {questions.length}</p>
      <progress 
        value={progress}
        max="100"/>
    </main>
  );
}


export default App

import { use, useState } from 'react'
import QuestionCard from './components/QuestionCard'
import Results from './components/Results';
import {questions} from "./data/questions";
import type { Answer } from './types/assessment';
import { calculatedRisk } from './lib/riskEngine';
import { saveAssessment } from './lib/saveAssessment';
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

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers)

    if (currentQuestion < questions.length - 1){
      setCurrentQuestion(currentQuestion + 1);
    }else{
      const result = calculatedRisk(updatedAnswers);
      console.log("Calling saveAssessment");
      saveAssessment(updatedAnswers, result.score);
      setIsComplete(true);
    }
  }

  function handleBack(){
    if(currentQuestion > 0){
      setAnswers(answers.slice(0, -1));
      setCurrentQuestion(currentQuestion - 1);
    }
  }

    //console.log(answers)
    console.log(calculatedRisk(answers));

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const RiskResult = calculatedRisk(answers);
  return (
    <main>
      <h1> Camp Safety</h1>
      {isComplete ? (
        <Results result={RiskResult} />
      ):( 
        <>

          <p> Question {currentQuestion + 1} of {questions.length}</p>
          <progress 
          value={progress}
          max="100"/>
      
        <QuestionCard 
        question={questions[currentQuestion]}
        onAnswer={handleAnswer}
        />

        {currentQuestion > 0 &&(
          <button
          type="button"
          onClick={handleBack}>
            Previous
          </button>
      )}
      </>
      )}
    </main>
  );
}


export default App

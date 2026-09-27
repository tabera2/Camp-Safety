import { useState } from 'react'
import QuestionCard from './components/QuestionCard'
import Results from './components/Results';
import {questions} from "./data/questions";
import type { Answer } from './types/assessment';
import { calculatedRisk } from './lib/riskEngine';
import { saveAssessment } from './lib/saveAssessment';
import './App.css'
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isComplete, setIsComplete] = useState(false)

  async function handleAnswer(answer: string) {
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
      //console.log("Calling saveAssessment");

      const saved = await saveAssessment(
        updatedAnswers,
        result.score
      );

      if(!saved){
        console.error("Assessment could not be saved.");
      }
      //saveAssessment(updatedAnswers, result.score);
      setIsComplete(true);
    }
  }

  function handleBack(){
    if(currentQuestion > 0){
      setAnswers(answers.slice(0, -1));
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  function handleRestart() {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
  }

    //console.log(answers)
    console.log(calculatedRisk(answers));

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const RiskResult = calculatedRisk(answers);
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
      Camp Safety
      </p>

      {!isComplete && (
      <>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Safety Readiness Assessment
        </h1>

        <p className="mt-2 text-muted-foreground">
          Identify potential gaps in your camp&apos;s emergency preparedness.
        </p>
      </>
      )}
      </header>


      {isComplete ? (
        <Results
          result={RiskResult}
          onRestart={handleRestart}
        />
      ):( 
        <div className="space-y-6">

        <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
        Question {currentQuestion + 1} of {questions.length}
        </span>

        <span className="text-muted-foreground">
        {Math.round(progress)}% complete
        </span>
        </div>

  <Progress value={progress} />
</div>
      
    <QuestionCard 
    question={questions[currentQuestion]}
    onAnswer={handleAnswer}
    />

    {currentQuestion > 0 && (
    <Button
    type="button"
    variant="ghost"
    onClick={handleBack}
    >
    <ArrowLeft />
    Previous
    </Button>
)}  
      </div>
      )}
    </main>
  );
}


export default App

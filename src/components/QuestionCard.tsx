import type { Question } from "../types/assessment";

interface QuestionCardProps {
    question: Question;
    onAnswer: (answer: string) => void;
}

function QuestionCard({ 
    question,
    onAnswer
 }: QuestionCardProps) {
    return (
        <section>
            <p>{question.category}</p>

            <h2>{question.question}</h2>
            {question.type == "boolean" && (
                <div>
                    <button 
                    type="button" 
                    onClick={() => onAnswer("Yes")}>
                        Yes
                        </button>
                    <button 
                    type="button" 
                    onClick={() => onAnswer("No")}>
                        No
                        </button>
                </div>
            )}

            {question.type == "multiple-choice" && (
                <div>
                    {question.options?.map((option) => (
                        <button 
                        type="button" 
                        key={option}
                        onClick={() => onAnswer(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

export default QuestionCard
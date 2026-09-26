import type { Question } from "../types/assessment";

interface QuestionCardProps {
    question: Question;
}

function QuestionCard({ question }: QuestionCardProps) {
    return (
        <section>
            <p>{question.category}</p>

            <h2>{question.question}</h2>
            {question.type == "boolean" && (
                <div>
                    <button type="button">Yes</button>
                    <button type="button">No</button>
                </div>
            )}

            {question.type == "multiple-choice" && (
                <div>
                    {question.options?.map((option) => (
                        <button type="button" key={option}>
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

export default QuestionCard
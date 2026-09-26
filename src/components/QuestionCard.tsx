import type { Question } from "../types/assessment";

interface QuestionCardProps {
    question: Question;
}

function QuestionCard({ question }: QuestionCardProps) {
    return (
        <section>
            <p>{question.category}</p>

            <h2>{question.question}</h2>
        </section>
    );
}

export default QuestionCard
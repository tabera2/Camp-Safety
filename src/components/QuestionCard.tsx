import type { Question } from "../types/assessment";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";


interface QuestionCardProps {
    question: Question;
    onAnswer: (answer: string) => void;
}

function QuestionCard({ 
    question,
    onAnswer
 }: QuestionCardProps) {
    return (
  <Card className="w-full">
    <CardHeader>
      <Badge variant="secondary" className="w-fit">
        {question.category}
      </Badge>

      <CardTitle className="text-2xl">
        {question.question}
      </CardTitle>

      <CardDescription>
        Select the answer that best describes your camp.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div className="flex flex-col gap-3">
        {question.type === "boolean" && (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onAnswer("Yes")}
            >
              Yes
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => onAnswer("No")}
            >
              No
            </Button>
          </>
        )}

        {question.type === "multiple-choice" &&
          question.options?.map((option) => (
            <Button
              key={option}
              variant="outline"
              size="lg"
              onClick={() => onAnswer(option)}
            >
              {option}
            </Button>
          ))}
      </div>
    </CardContent>
  </Card>
);
}

export default QuestionCard
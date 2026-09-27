export type QuestionType = 
| "boolean"
| "multiple-choice";

export interface Question {
    id: number;
    category: string;
    question: string;
    type: QuestionType;
    options?: string[];
}

export interface Answer{
    questionId: number;
    answer: string;
}

export interface RiskGap{
    questionId: number;
    title: string;
    description: string;
    points: number;
}
export interface RiskResult{
    score: number;
    gaps: RiskGap[];
}
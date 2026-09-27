import {supabase} from "./supabase";
import type {Answer} from "../types/assessment";

export async function saveAssessment(
    answer: Answer[],
    riskScore: number
){
    const assessmentId = crypto.randomUUID();
    const {error: assessmentError} = await supabase
    .from("assessments")
    .insert({
        id: assessmentId,
        risk_score: riskScore,
    });

    if (assessmentError){
        console.error(
            "Error saving assessment:",
            assessmentError
        );
        return;
    }

    const responseRows = answer.map((answer) => ({
        assessment_id: assessmentId,
        question_id: answer.questionId,
        answer: answer.answer,
    }));

    const {error: responseError} = await supabase
        .from("responses")
        .insert(responseRows);

        if(responseError){
            console.error(
                "Error saving responses:",
                responseError
            );
            return;
        }
        console.log("Assessment saved successfully");
    
}
import type {
    Answer,
    RiskGap,
    RiskResult
} from "../types/assessment";

export function calculatedRisk(answers: Answer[]): RiskResult{
    let score = 0;
    const gaps: RiskGap[] = [];

    answers.forEach((answer) => {
        if(answer.questionId === 1 && answer.answer == "No"){
            score += 25;
            gaps.push({
                questionId: 1,
                title: "Emergency Action Plan",
                description:
                "The camp does not have a documented Emergency Action Plan.",
                points: 25,
            });
        }

        if(answer.questionId === 2 && answer.answer === "More than 1 year ago"){
            score += 15;
            gaps.push({
                questionId: 2,
                title: "Emergency Plan Review",
                description: "The EAP has not been reviewed within the past year",
                points: 15,
            });
        }

        if(answer.questionId == 2 && answer.answer === "Not Sure"){
            score += 10;
            gaps.push({
                questionId: 2,
                title: "Emergency Plan Review",
                description: "The most recent EAP review date is unknown.",
                points: 10,
            });
        }

        if(answer.questionId == 3 && answer.answer === "No"){
            score += 15;
            gaps.push({
                questionId: 3,
                title: "Evacuation Routes",
                description: "Evacuation routes are not clearly documented.",
                points: 15,
            });
        }

        if(answer.questionId === 4 && answer.answer == "No"){
            score += 20;
            gaps.push({
                questionId: 4,
                title: "Staff Emergency Training",
                description: "Staff are not trained on emergency procedures.",
                points: 20,
            });
        }

        if(answer.questionId === 5 && answer.answer === "No"){
            score += 15;
            gaps.push({
                questionId: 5,
                title: "Emergency Drills",
                description: "The camp has not conducted a rencent emergency drill.",
                points: 15,
            });
        }

        if(answer.questionId === 6 && answer.answer == "No"){
            score += 10;
            gaps.push({
                questionId: 6,
                title: "Drill Documentation",
                description: "Emergency drills are not formally documented.",
                points: 10,
            });
        }
    
        });


    return{
        score,
        gaps,
    };
}
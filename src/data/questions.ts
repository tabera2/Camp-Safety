import type { Question } from "../types/assessment";
export const question: Question[] = [
    {
        id: 1,
        category: "Emergency Preparedness",
        question: "Does your camp have a documented Emergency Action Plan?",
        type: "boolean",
    },
    {
        id: 2,
        category: "Emergency Preparedness",
        question: "When was the Emergency Action Plan last reviewed?",
        type: "multiple-choice",
        options: [
            "Within 6 months",
            "6-12 months ago",
            "More than 1 year ago",
            "Not sure",
        ],
    },
    {
        id: 3,
        category: "Emergency Preparedness",
        question: "Are evacuation routes clearly documented?",
        type: "boolean",
    },
    {
        id: 4,
        category: "Staff Preparedness",
        question: "Are staff trained on emergency procedures?",
        type: "boolean",
    },
    {
        id: 5,
        category: "Emergency Preparedness",
        question: "Has the camp conducted an emergency drill recently?",
        type: "boolean",
    },
    {
        id: 6,
        category: "Staff Preparedness",
        question: "Are emergency drills formally documented?",
        type: "boolean", 
    },
];
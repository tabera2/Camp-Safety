import type { RiskResult } from "../types/assessment";
import { useEffect, useState, useRef } from "react";
//import type { RiskResult } from "../types/assessment";
import { getRecommendations } from "../lib/getRecommendations";
import ReactMarkdown from "react-markdown";



interface ResultProps{
    result: RiskResult;
}

function Results({ result }: ResultProps){
    const [recommendations, setRecommendations] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recommendationError, setRecommendationError] = useState(false);
    const hasRequestedRecommendations = useRef(false);

    useEffect(() => {
        async function loadRecommendations() {
            if(result.gaps.length === 0){
                return;
            }

            if(hasRequestedRecommendations.current){
                return;
            }
            hasRequestedRecommendations.current = true;

            setIsLoading(true);
            const response = await getRecommendations(
                result.score,
                result.gaps
            );

            if(response){
                setRecommendations(response);

            }else{
                setRecommendationError(true)
            }
            setIsLoading(false);
        }
        loadRecommendations();
    }, [result]);

    return(
        <section>
            <h2>Assessment Results</h2>
            <div>
                <h3>Risk Score</h3>
                <p>{result.score}/100</p>
                <p>Lower scores indicate fewer identified risk signals.</p>
            </div>

            <div>
                <h3>
                    Identified Safety Gaps
                </h3>
                {result.gaps.length === 0 ?(
                    <p>No safety gaps were identified by this assessment.</p>
                ) : (
                result.gaps.map((gap) => (
                    <div key={gap.questionId}>
                        <span className="warning-icon">&#9888;</span>
                        <h4>{gap.title}</h4>
                        <p>{gap.description}</p>
                        <p>+{gap.points} risk points</p>
                    </div>
                ))
            )}
            </div>

            {/* Recommendations goes here */}
            <div>
                <h3>Recommended Actions</h3>
                {isLoading && (
                    <p>Generating recommendations ... </p>
                )}

                {recommendationError && (
                    <p>Recommendations are temporarily unavailable.</p>
                )}

                {recommendations && (
                    <div className="recommendations">
                        <ReactMarkdown>
                            {recommendations}
                        </ReactMarkdown>
                        
                    </div>
                )}
            </div>
        </section>
    );
}

export default Results;
import type { RiskResult } from "../types/assessment";

interface ResultProps{
    result: RiskResult;
}

function Results({ result }: ResultProps){
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
        </section>
    );
}

export default Results;
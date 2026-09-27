import type { RiskResult } from "../types/assessment";
import { useEffect, useState, useRef } from "react";
//import type { RiskResult } from "../types/assessment";
import { getRecommendations } from "../lib/getRecommendations";
import ReactMarkdown from "react-markdown";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";



interface ResultProps {
  result: RiskResult;
  onRestart: () => void;
}

function Results({ result, onRestart }: ResultProps){
    const [recommendations, setRecommendations] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recommendationError, setRecommendationError] = useState(false);
    const hasRequestedRecommendations = useRef(false);

    async function loadRecommendations() {
        if(result.gaps.length === 0){
            return;
        }

        setIsLoading(true);
        setRecommendationError(false);
        setRecommendations(null);

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

    useEffect(() => {
        if(hasRequestedRecommendations.current){
                return;
            }
        hasRequestedRecommendations.current = true;
        loadRecommendations();
    }, [result]);

    return (
  <section className="space-y-8">
    {/* Page heading */}
    <div>
        <h1 className="text-3xl font-semibold tracking-tight">
        Your Assessment Results
        </h1>
      <p className="mt-2 text-muted-foreground">
        Review your risk score, identified safety gaps, and recommended actions.
      </p>
    </div>

    {/* Risk Score */}
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Risk Score</CardTitle>
            <CardDescription className="mt-1">
              Lower scores indicate fewer identified risk signals.
            </CardDescription>
          </div>

          <Badge variant="secondary" className="px-4 py-2 text-lg">
            {result.score}/100
          </Badge>
        </div>
      </CardHeader>
    </Card>

    {/* Safety Gaps */}
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">Identified Safety Gaps</h3>
        <p className="text-sm text-muted-foreground">
          Areas that may need additional attention.
        </p>
      </div>

      {result.gaps.length === 0 ? (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>No safety gaps identified</AlertTitle>
          <AlertDescription>
            This assessment did not identify any safety gaps based on your
            responses.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardContent className="p-0">
            {result.gaps.map((gap, index) => (
              <div key={gap.questionId}>
                <div className="flex gap-4 p-6">
                  <div className="mt-1">
                    <AlertTriangle className="size-5 text-amber-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h4 className="font-semibold">{gap.title}</h4>

                      <Badge variant="outline">
                        +{gap.points} risk points
                      </Badge>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {gap.description}
                    </p>
                  </div>
                </div>

                {index < result.gaps.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>

    {/* Recommended Actions */}
    {result.gaps.length > 0 && (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5" />

          <div>
            <h3 className="text-xl font-semibold">Recommended Actions</h3>
            <p className="text-sm text-muted-foreground">
              Suggested next steps based on the gaps identified above.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {isLoading && (
              <div className="space-y-2">
                <p className="font-medium">Generating recommendations...</p>
                <p className="text-sm text-muted-foreground">
                  Reviewing your assessment results.
                </p>
              </div>
            )}

    {recommendationError && (
        <Alert>
        <AlertTriangle />

        <AlertTitle>
         Recommendations unavailable
        </AlertTitle>

        <AlertDescription>
        <div className="space-y-3">
        <p>
          We couldn't generate recommendations right now.
          Your assessment results are still available.
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadRecommendations}
          disabled={isLoading}
        >
          Try Again
        </Button>
        </div>
        </AlertDescription>
        </Alert>
    )}

            {recommendations && (
  <div className="recommendations">
    <ReactMarkdown
      components={{
        h3: ({ children }) => (
          <h3 className="mt-6 mb-3 text-lg font-semibold first:mt-0">
            {children}
          </h3>
        ),

        p: ({ children }) => (
          <p className="mb-3 text-sm leading-6 text-muted-foreground">
            {children}
          </p>
        ),

        ul: ({ children }) => (
          <ul className="mb-5 space-y-3">
            {children}
          </ul>
        ),

        li: ({ children }) => (
          <li className="ml-5 list-disc text-sm leading-6">
            {children}
          </li>
        ),

        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">
            {children}
          </strong>
        ),

        hr: () => <Separator className="my-6" />,
      }}
    >
      {recommendations}
    </ReactMarkdown>
  </div>
)}
          </CardContent>
        </Card>
      </div>
    )}

    <Button
    type="button"
    onClick={onRestart}
    className="w-full sm:w-auto"
    >
    Start New Assessment
    </Button>
  </section>
);
}

export default Results;
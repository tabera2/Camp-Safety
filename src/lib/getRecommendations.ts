import { supabase } from "./supabase";
import type { RiskGap } from "../types/assessment";

export async function getRecommendations(
  score: number,
  gaps: RiskGap[]
) {
  const { data, error } = await supabase.functions.invoke(
    "generate-recommendations",
    {
      body: {
        score,
        gaps,
      },
    }
  );

  if (error) {
    console.error("Error generating recommendations:", error);
    return null;
  }

  return data.recommendations;
}
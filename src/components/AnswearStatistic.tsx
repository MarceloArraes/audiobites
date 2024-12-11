"use client";
import { api } from "@/trpc/react";
import { Progress } from "./ui/progress";

interface AnswearStatisticProps {
  questionId: number;
  answered: boolean;
}

export const AnswearStatistic = ({
  questionId,
  answered,
}: AnswearStatisticProps) => {
  const { data: responsesToQuestions } =
    api.question.getQuestionResponseStatistics.useQuery({ questionId });
  console.log("responsesToQuestions", responsesToQuestions);

  if (!responsesToQuestions || !answered) return;

  return (
    <div>
      {responsesToQuestions?.optionsBreakdown?.map((option, _index) => {
        return (
          <div
            key={option.optionId}
            className={`mb-2 ${option.correctOption ? "" : ""}`}
          >
            <div className="flex justify-between text-sm">
              <span>{option.optionText}</span>
              <span>
                {option.count} votos ({option.percentage}%)
              </span>
            </div>
            <Progress
              value={parseFloat(option.percentage)}
              correctOption={option.correctOption}
              className="h-2"
            />
          </div>
        );
      })}
    </div>
  );
};

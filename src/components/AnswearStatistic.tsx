"use client";
import { api } from "@/trpc/react";
import { Progress } from "./ui/progress";

interface AnswearStatisticProps {
  questionId: number;
}

export const AnswearStatistic = ({ questionId }: AnswearStatisticProps) => {
  const { data: responsesToQuestions } =
    api.question.getQuestionResponseStatistics.useQuery({ questionId });
  console.log("responsesToQuestions", responsesToQuestions);
  /* 
  const votes = simulatedResults[index].votes[optionIndex];
                    const totalVotes = simulatedResults[index].votes.reduce(
                      (sum, v) => sum + v,
                      0
                    );
  */

  /* 
  optionsBreakdown
: 
Array(3)
0
: 
{optionId: 1, optionText: '123', count: 3, percentage: '13.64'}
1
: 
{optionId: 2, optionText: '333', count: 8, percentage: '36.36'}
2
: 
{optionId: 3, optionText: '555', count: 11, percentage: '50.00'}
length
: 
3
[[Prototype]]
: 
Array(0)
totalRespon s
: 
22
  */

  /* 
responsesToQuestions: {
    totalResponses: number;
    optionsBreakdown: {
        optionId: number;
        optionText: string;
        count: number;
        percentage: string;
    }[];
} | undefined
*/
  if (!responsesToQuestions) return;

  return (
    <div>
      {responsesToQuestions?.optionsBreakdown?.map((option, _index) => {
        return (
          <div key={option.optionId} className="mb-2">
            <div className="flex justify-between text-sm">
              <span>{option.optionText}</span>
              <span>
                {option.count} votos ({option.percentage}%)
              </span>
            </div>
            <Progress value={parseFloat(option.percentage)} className="h-2" />
          </div>
        );
      })}
    </div>
  );
};

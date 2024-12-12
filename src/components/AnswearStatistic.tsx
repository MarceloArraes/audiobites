"use client";
import { api } from "@/trpc/react";
import { Progress } from "./ui/progress";
import { useMemo } from "react";

interface AnswearStatisticProps {
  questionId: number;
  answered: number | undefined;
  newOptionsArray: number[];
}

export const AnswearStatistic = ({
  questionId,
  answered,
  newOptionsArray,
}: AnswearStatisticProps) => {
  const { data: responsesToQuestions } =
    api.question.getQuestionResponseStatistics.useQuery({ questionId });
  console.log("newOptionsArray", newOptionsArray);
  console.log("answered", answered);
  // const newOptionsArray = useMemo(
  //   () =>
  //     responsesToQuestions?.optionsBreakdown.sort(function () {
  //       return 0.5 - Math.random();
  //     }),
  //   [responsesToQuestions],
  // );
  if (!responsesToQuestions || !answered) return;

  return (
    <div>
      {newOptionsArray?.map((option, _index) => {
        const sortedOption = responsesToQuestions?.optionsBreakdown.find(
          (responseOption) => responseOption.optionId == option.id,
        );
        return (
          <>
            <div
              key={sortedOption?.optionId}
              className={`mb-2 ${sortedOption?.correctOption ? "" : ""}`}
            >
              {answered == sortedOption?.optionId && (
                <div
                  className={`mt-4 rounded p-3 text-center ${sortedOption?.correctOption ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {sortedOption?.correctOption
                    ? "Correct! Well done!"
                    : "Incorrect. Try again next time."}
                </div>
              )}
              <div
                // key={index}
                // onClick={() => handleOptionSelect(sortedOption?)}
                // disabled={showResult}
                className={`w-full rounded p-2 text-left transition-colors duration-300 ${
                  sortedOption?.correctOption &&
                  answered === sortedOption?.optionId
                    ? "bg-green-500 text-white"
                    : answered === sortedOption?.optionId
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span>{sortedOption?.optionText} </span>
                    <span className="ml-auto">{sortedOption?.percentage}%</span>
                  </div>
                  <Progress
                    value={parseFloat(sortedOption?.percentage)}
                    correctOption={false}
                    className="h-2"
                  />
                </div>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span>{option.optionText}</span>
                <span>
                  {option.count} votos ({option.percentage}%)
                </span>
              </div> */}
            </div>
          </>
        );
      })}
    </div>
  );
};

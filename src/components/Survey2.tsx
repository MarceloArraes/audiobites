"use client";
import { api } from "@/trpc/react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { AnswearStatistic } from "./AnswearStatistic";

export const SurveyComponent2 = () => {
  const { data: questions } =
    api.question.getAllQuestionsWithOptions.useQuery();
  const submitResponseMutation = api.question.submitResponse.useMutation();
  //   const { data: responsesToQuestions } =
  //     api.question.getQuestionResponseStatistics.useQuery({questionId});
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions?.length ?? 2).fill(null),
  );
  console.log("initial answers", answers);
  const getUserId = () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = crypto.randomUUID(); // Modern browsers
      // Or a fallback:
      // userId = Math.random().toString(36).substring(2, 15) +
      //          Math.random().toString(36).substring(2, 15);
      localStorage.setItem("userId", userId);
      console.log("useRId", userId);
    }
    return userId;
  };

  // useEffect(()=>{
  //     getUserId();
  // },[])
  const handleAnswer = async (questionId: number, optionId: number) => {
    // if (questionIndex && answer) {
    const newAnswers = [...answers];
    newAnswers[questionId] = optionId;
    console.log("questionId, optionId", questionId, optionId);
    // console.log(
    //   "questions?.[questionIndex]?.options?.[answer]?.id",
    //   questions?.[questionIndex]?.options?.[answer],
    // );
    // questions[questionIndex] received the answear = question.option.optionId = answer;
    console.log("newAnswers", newAnswers);
    setAnswers(newAnswers);
    await handleSubmitResponse(questionId ?? null, optionId ?? null);
    // }
  };

  const handleSubmitResponse = async (
    questionId: number | null,
    optionId: number | null,
  ) => {
    // Generate or obtain a unique respondent identifier
    console.log("entered handleSubmitResponse", questionId, optionId);
    if (!questionId || !optionId) return;
    const respondentId = getUserId();
    // const respondentId = generateRespondentId();

    await submitResponseMutation.mutateAsync({
      questionId,
      optionId,
      respondentIdentifier: respondentId,
    });
  };
  console.log("questions", questions);
  //   console.log("responsesToQuestions", responsesToQuestions);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-600 py-12">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Pesquisa Política</CardTitle>
          <CardDescription>
            Responda as perguntas abaixo e veja os resultados imediatamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questions?.map((question, index) => (
            <div key={question.id} className="mb-8">
              <p className="mb-2 text-lg font-semibold">{question.text}</p>
              <RadioGroup
                // onValueChange={(value: string) =>
                //   handleAnswer(index, parseInt(value))
                // }
                value={answers[index + 1]?.toString()}
              >
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="mb-2 flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.id?.toString()}
                      id={`q${question.id}-option-${optionIndex}`}
                      onClick={() => handleAnswer(question.id, option.id)}
                    />
                    <Label htmlFor={`q${question.id}-option-${optionIndex}`}>
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {answers[index + 1] && (
                <AnswearStatistic questionId={question.id} />
              )}
            </div>
          ))}
        </CardContent>
        <Button type="button" onClick={() => handleSubmitResponse(1, 1)}>
          submit
        </Button>
      </Card>
    </div>
  );
};

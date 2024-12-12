"use client";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Question } from "./Question";

export const SurveyComponent2 = () => {
  const { data: questions } =
    api.question.getAllQuestionsWithOptions.useQuery();
  //   const { data: responsesToQuestions } =
  //     api.question.getQuestionResponseStatistics.useQuery({questionId});
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions?.length ?? 2).fill(null),
  );

  console.log("questions", questions);
  //   console.log("responsesToQuestions", responsesToQuestions);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-600 py-12">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Audio Bites</CardTitle>
          <CardDescription>Can you guess what is this sound?</CardDescription>
        </CardHeader>
        <CardContent>
          {questions?.map((question, index) => {
            return (
              <Question
                key={index}
                question={question}
                answers={answers}
                setAnswers={setAnswers}
              />
            );
          })}
        </CardContent>
        {/* <Button type="button" onClick={() => handleSubmitResponse(1, 1)}>
          submit
        </Button> */}
      </Card>
    </div>
  );
};

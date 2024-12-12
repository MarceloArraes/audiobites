"use client";
import { Label } from "@radix-ui/react-label";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import { AnswearStatistic } from "./AnswearStatistic";
import { api } from "@/trpc/react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface QuestionProps {
  question: {
    options: {
      questionId: number;
      id: number;
      text: string;
      correct: boolean;
    }[];
  } & {
    description: string | null;
    id: number;
    text: string;
    category: string | null;
    contentUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  answers: number[];
  setAnswers: Dispatch<SetStateAction<number[]>>;
}

export const Question = ({ question, answers, setAnswers }: QuestionProps) => {
  const submitResponseMutation = api.question.submitResponse.useMutation();

  const newOptionsArray = useMemo(
    () =>
      question?.options.sort(function () {
        return 0.5 - Math.random();
      }),
    [question],
  );
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
    setAnswers(newAnswers);
    await handleSubmitResponse(questionId ?? null, optionId ?? null);
    // }
  };

  return (
    <div key={question.id} className="mb-8">
      {/* <p className="mb-2 text-lg font-semibold">{question.text}</p> */}
      {/* <audio src="/sounds/door-opening-and-closing-18398.mp3"></audio> */}
      <audio controls>
        {/* <source src="horse.ogg" type="audio/ogg" /> */}
        <source
          // src="/sounds/door-opening-and-closing-18398.mp3"
          src={question.contentUrl ?? ""}
          type="audio/mp3"
        />
        Your browser does not support the audio element.
      </audio>
      <RadioGroup
        // onValueChange={(value: string) =>
        //   handleAnswer(index, parseInt(value))
        // }
        className="p-4 pl-5"
        value={answers[question.id]?.toString()}
      >
        {newOptionsArray.map((option, optionIndex) => {
          return (
            <div key={optionIndex} className="mb-2 flex items-center space-x-2">
              <RadioGroupItem
                value={option.id?.toString()}
                id={`q${question.id}-option-${option.id}`}
                onClick={() => handleAnswer(question.id, option.id)}
              />
              <Label htmlFor={`q${question.id}-option-${option.id}`}>
                {option.text}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {/* {answers[index + 1] != null && <div>Answered</div>} */}
      <AnswearStatistic
        questionId={question.id}
        answered={answers[question.id]}
        newOptionsArray={newOptionsArray}
      />
    </div>
  );
};

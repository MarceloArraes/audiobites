import React, { useState, useEffect } from "react";
import { createHash } from "crypto";

// Utility to generate a consistent hash for tracking
const generateRespondentHash = () => {
  // In a real app, you'd use a combination of IP, cookie, or other unique identifier
  const browserFingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ].join("|");

  return createHash("sha256").update(browserFingerprint).digest("hex");
};

// Mock survey data (would typically come from backend)
const initialQuestions = [
  {
    id: 1,
    text: "O presidente atual é corrupto?",
    options: ["Sim", "Não", "Não tenho certeza"],
  },
  {
    id: 2,
    text: "A economia do país está melhorando?",
    options: ["Sim", "Não", "Está estável"],
  },
  {
    id: 3,
    text: "Você confia no sistema eleitoral?",
    options: ["Sim", "Não", "Parcialmente"],
  },
  {
    id: 4,
    text: "A educação pública precisa de mais investimentos?",
    options: ["Sim", "Não", "O investimento atual é suficiente"],
  },
];

export const SurveyComponent: React.FC = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [respondentHash, setRespondentHash] = useState("");

  useEffect(() => {
    // Generate a unique hash for this respondent
    const hash = generateRespondentHash();
    setRespondentHash(hash);
  }, []);

  const handleResponseChange = (questionId: number, selectedOption: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const submitSurvey = async () => {
    try {
      // In a real app, you'd send this to your backend
      const surveySubmission = {
        respondentHash,
        responses: Object.entries(responses).map(
          ([questionId, selectedOption]) => ({
            questionId: parseInt(questionId),
            selectedOption,
          }),
        ),
      };

      // Simulate API call to save survey
      console.log("Submitting survey:", surveySubmission);

      // Reset or show thank you message
      alert("Obrigado por responder a pesquisa!");
      setResponses({});
    } catch (error) {
      console.error("Erro ao submeter pesquisa", error);
    }
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Pesquisa de Opinião</h1>
      {questions.map((question) => (
        <div key={question.id} className="mb-4">
          <p className="mb-2 font-semibold">{question.text}</p>
          <div className="space-y-2">
            {question.options.map((option) => (
              <label key={option} className="block">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={() => handleResponseChange(question.id, option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={submitSurvey}
        disabled={Object.keys(responses).length !== questions.length}
        className="rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Enviar Respostas
      </button>
    </div>
  );
};

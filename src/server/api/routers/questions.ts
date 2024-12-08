import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import crypto from "crypto";

export const questionRouter = createTRPCRouter({
  // Get all questions with their options
  getAllQuestionsWithOptions: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.surveyQuestion.findMany({
      include: {
        options: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }),

  // Get a specific question by ID with its options
  getQuestionById: publicProcedure
    .input(z.object({ questionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.surveyQuestion.findUnique({
        where: { id: input.questionId },
        include: {
          options: true,
        },
      });
    }),

  // Submit a survey response
  submitResponse: publicProcedure
    .input(
      z.object({
        questionId: z.number(),
        optionId: z.number(),
        respondentIdentifier: z.string(), // Could be IP hash, session ID, etc.
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Generate a consistent hash for the respondent
      const respondentHash = crypto
        .createHash("sha256")
        .update(input.respondentIdentifier)
        .digest("hex");

      // Create an audit log entry
      await ctx.db.surveyAuditLog.create({
        data: {
          action: "respond",
          respondentHash: respondentHash,
          metadata: {
            questionId: input.questionId,
            optionId: input.optionId,
          },
        },
      });

      // Submit the response
      return ctx.db.surveyResponse.create({
        data: {
          questionId: input.questionId,
          optionId: input.optionId,
          respondentHash: respondentHash,
        },
      });
    }),

  // Get response statistics for a question
  getQuestionResponseStatistics: publicProcedure
    .input(z.object({ questionId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Get total responses for the question
      const totalResponses = await ctx.db.surveyResponse.count({
        where: { questionId: input.questionId },
      });

      // Get response distribution across options
      const responseDistribution = await ctx.db.surveyResponse.groupBy({
        by: ["optionId"],
        where: { questionId: input.questionId },
        _count: {
          optionId: true,
        },
      });

      // Fetch options to get their text
      const optionsWithCount = await Promise.all(
        responseDistribution.map(async (distribution) => {
          const option = await ctx.db.surveyOption.findUnique({
            where: { id: distribution.optionId },
          });

          return {
            optionId: distribution.optionId,
            optionText: option?.text ?? "Unknown",
            count: distribution._count.optionId,
            percentage: (
              (distribution._count.optionId / totalResponses) *
              100
            ).toFixed(2),
          };
        }),
      );

      return {
        totalResponses,
        optionsBreakdown: optionsWithCount,
      };
    }),

  // Check if a respondent has already answered a specific question
  hasRespondedToQuestion: publicProcedure
    .input(
      z.object({
        questionId: z.number(),
        respondentIdentifier: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const respondentHash = crypto
        .createHash("sha256")
        .update(input.respondentIdentifier)
        .digest("hex");

      const existingResponse = await ctx.db.surveyResponse.findFirst({
        where: {
          questionId: input.questionId,
          respondentHash: respondentHash,
        },
      });

      return !!existingResponse;
    }),
});

export const surveyRouter = createTRPCRouter({
  question: questionRouter,
});

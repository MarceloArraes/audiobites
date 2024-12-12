import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data to prevent conflicts
  await prisma.surveyResponse.deleteMany();
  await prisma.surveyAuditLog.deleteMany();
  await prisma.surveyOption.deleteMany();
  await prisma.surveyQuestion.deleteMany();

  // Seed Questions with Options
  const questions = [
    {
      text: "What sound is this?",
      description: "A sound effect to identify",
      category: "Sound",
      contentUrl: "sounds/door-opening-and-closing-18398.mp3",
      options: [
        { text: "Door opening and closing", correct: true },
        { text: "Window blinds rattling", correct: false },
        { text: "Wooden fence creaking", correct: false },
      ],
    },
    {
      text: "What object is making this sound?",
      description: "Identifying the source of the noise",
      category: "Sound",
      contentUrl: "sounds/empty-beer-can-table-foley-drop-4-238695.mp3",
      options: [
        { text: "Empty beer can dropping on a table", correct: true },
        { text: "Metal coin spinning on a surface", correct: false },
        { text: "Soda can being crushed", correct: false },
      ],
    },
    {
      text: "What sound is being produced?",
      description: "Recognizing the audio effect",
      category: "Sound",
      contentUrl: "sounds/empty-mug-table-foley-wobble-3-239012.mp3",
      options: [
        { text: "Glass cup rolling on its side", correct: false },
        { text: "Ceramic plate sliding", correct: false },
        { text: "Empty mug wobbling on a table", correct: true },
      ],
    },
    {
      text: "What action is creating this sound?",
      description: "Identifying the source of the audio",
      category: "Sound",
      contentUrl: "sounds/footsteps-on-nature-trail-246038.mp3",
      options: [
        { text: "Leaves rustling in wind", correct: false },
        { text: "Footsteps on a nature trail", correct: true },
        { text: "Branches snapping", correct: false },
      ],
    },
    {
      text: "What tool is making this sound?",
      description: "Recognizing the sound of a tool in use",
      category: "Sound",
      contentUrl: "sounds/hand-saw-cutting-tree-3-230193.mp3",
      options: [
        { text: "Axe chopping wood", correct: false },
        { text: "Electric hedge trimmer", correct: false },
        { text: "Hand saw cutting a tree", correct: true },
      ],
    },
    {
      text: "What kitchen action is being performed?",
      description: "Identifying a food preparation sound",
      category: "Sound",
      contentUrl: "sounds/knife-cut-veggies-foley-4-211705.mp3",
      options: [
        { text: "Knife cutting vegetables", correct: true },
        { text: "Peeling a potato", correct: false },
        { text: "Stirring a pot", correct: false },
      ],
    },
    {
      text: "What underwater event is occurring?",
      description: "Recognizing a specific aquatic sound",
      category: "Sound",
      contentUrl: "sounds/large-underwater-explosion-190270.mp3",
      options: [
        { text: "Whale song underwater", correct: false },
        { text: "Large underwater explosion", correct: true },
        { text: "Submarine sonar ping", correct: false },
      ],
    },
    {
      text: "What writing action is happening?",
      description: "Identifying a writing sound",
      category: "Sound",
      contentUrl: "sounds/pencil-write-desk-paper-loop-3-215731.mp3",
      options: [
        { text: "Pencil writing on desk paper", correct: true },
        { text: "Typing on a keyboard", correct: false },
        { text: "Erasing with an eraser", correct: false },
      ],
    },
    {
      text: "What liquid is being poured?",
      description: "Recognizing a pouring sound",
      category: "Sound",
      contentUrl: "sounds/pour-coffee-5-198470.mp3",
      options: [
        { text: "Coffee being poured", correct: true },
        { text: "Water from a kettle", correct: false },
        { text: "Wine being poured", correct: false },
      ],
    },
  ];
  // Function to generate a consistent hash for audit logging
  function generateRespondentHash() {
    return crypto.randomBytes(16).toString("hex");
  }

  // Seed data with transactions
  for (const questionData of questions) {
    // Create question
    const question = await prisma.surveyQuestion.create({
      data: {
        text: questionData.text,
        description: questionData.description,
        category: questionData.category,
        contentUrl: questionData.contentUrl,
        options: {
          create: questionData.options.map((option) => ({
            text: option.text,
            correct: option.correct,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    // Optional: Create some sample responses for demonstration
    const respondentHash = generateRespondentHash();
    const randomOptionIndex = Math.floor(
      Math.random() * question.options.length,
    );

    await prisma.surveyResponse.create({
      data: {
        questionId: question.id,
        optionId: question?.options[randomOptionIndex]?.id ?? 1,
        respondentHash: respondentHash,
      },
    });

    // Log the survey interaction
    await prisma.surveyAuditLog.create({
      data: {
        action: "respond",
        respondentHash: respondentHash,
        metadata: {
          questionId: question.id,
          optionId: question?.options?.[randomOptionIndex]?.id,
        },
      },
    });
  }

  console.log("Seeding complete");
}

// For ES Module support in Next.js
export default main;

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .finally(async () => {
      await prisma.$disconnect();
    });
}

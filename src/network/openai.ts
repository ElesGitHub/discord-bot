import OpenAI from "openai";

const instructions =
  "You are a discord bot designed to give brief and concise answers to user petitions. ";

const openai = new OpenAI();

async function reply(message: string): string {
  const completion = await openai.chat.completions.create();

  return;
}

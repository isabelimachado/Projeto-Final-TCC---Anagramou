/* import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const response = openai.responses.create({
  model: "gpt-4o-mini",
  input: "write a haiku about ai",
  store: true,
});

response.then((result) => console.log(result.output_text)); */


import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5",
    input: "Write a one-sentence bedtime story about a unicorn."
});

console.log(response.output_text);
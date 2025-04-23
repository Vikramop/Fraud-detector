import { NextRequest, NextResponse } from "next/server";
import {OpenAI} from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function POST(req : NextRequest) {

    const { code } = await req.json();

  if (!code || typeof code !== 'string') {
    NextResponse.json({message : "code is wrong"})
    return 
  }

  try {
    const prompt = `
You are a smart contract security expert. Analyze the following Solidity code for vulnerabilities such as reentrancy, integer overflows, access control issues, and uninitialized storage pointers. Provide a corrected version of the code with explanations for each change.

Solidity Code:
\`\`\`solidity
${code}
\`\`\`
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    //@ts-ignore
    const result = completion.choices[0].message.content;

    NextResponse.json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error);
    NextResponse.json({ error: 'Internal server error' });
  }

}
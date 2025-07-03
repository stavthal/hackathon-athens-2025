import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Validate conversation history format
    const validHistory = Array.isArray(conversationHistory)
      ? conversationHistory.filter(
          (msg) =>
            msg &&
            typeof msg === "object" &&
            msg.role &&
            msg.content &&
            (msg.role === "user" || msg.role === "assistant")
        )
      : [];

    // Build the complete conversation history for Claude
    // Include previous messages and the new user message
    const messages = [
      ...validHistory,
      {
        role: "user",
        content: message,
      },
    ];

    // Limit conversation history to prevent token limit issues
    // Keep last 20 messages (10 exchanges) for context
    const maxMessages = 20;
    const recentMessages =
      messages.length > maxMessages ? messages.slice(-maxMessages) : messages;

    console.log(
      `Sending ${recentMessages.length} messages to Claude for context`
    );

    // Using Claude 3.5 Haiku with conversation context
    const input = {
      modelId: "anthropic.claude-3-5-haiku-20241022-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: recentMessages,
        system:
          "You are a helpful AI assistant. You have access to the conversation history and can reference previous messages to provide contextual responses. Be conversational and remember what the user has told you in this session.",
      }),
    };

    // Alternative models (uncomment if Claude 3.5 Sonnet is not available):

    // Claude 3 Haiku (fast and cost-effective):
    /*
    const input = {
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    };
    */

    // Amazon Titan Text (usually available by default):
    /*
    const input = {
      modelId: "amazon.titan-text-express-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: message,
        textGenerationConfig: {
          maxTokenCount: 1000,
          temperature: 0.7,
        },
      }),
    };
    */

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    // Handle Claude response format
    const assistantMessage = responseBody.content[0].text;

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error calling Bedrock:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI agent" },
      { status: 500 }
    );
  }
}

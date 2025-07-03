// Test script to verify AWS Bedrock setup
import {
  BedrockRuntimeClient,
  ListFoundationModelsCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testBedrock() {
  try {
    console.log("Testing AWS Bedrock connection...");
    console.log("Region:", process.env.AWS_REGION);
    console.log(
      "Access Key ID:",
      process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) + "..."
    );

    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);

    console.log("\nAvailable models:");
    response.modelSummaries.forEach((model) => {
      console.log(`- ${model.modelId}`);
    });

    // Check if Claude 3 Haiku is available
    const claudeHaiku = response.modelSummaries.find((m) =>
      m.modelId.includes("claude-3-haiku")
    );

    if (claudeHaiku) {
      console.log("\n✅ Claude 3 Haiku is available!");
    } else {
      console.log(
        "\n❌ Claude 3 Haiku is not available. You need to enable model access."
      );
    }
  } catch (error) {
    console.error("Error:", error.message);

    if (error.name === "AccessDeniedException") {
      console.log("\n❌ Access denied. Check your:");
      console.log("1. AWS credentials");
      console.log("2. IAM permissions");
      console.log("3. Model access in Bedrock console");
    }
  }
}

testBedrock();

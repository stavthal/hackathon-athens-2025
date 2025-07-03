# AWS Bedrock Chatbot Setup

This project includes a functional AI chatbot using AWS Bedrock and Next.js API routes.

## Setup Instructions

### 1. AWS Credentials Setup

You need to set up your AWS credentials to use AWS Bedrock. Create a `.env.local` file in the root directory with the following:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

### 2. AWS Bedrock Model Access

Make sure you have access to the Claude 3 Haiku model in AWS Bedrock:

1. Go to AWS Console → Bedrock → Model Access
2. Request access to `anthropic.claude-3-haiku-20240307-v1:0`
3. Wait for approval (usually instant for Haiku)

### 3. IAM Permissions

Ensure your AWS credentials have the following permissions:

- `bedrock:InvokeModel`
- `bedrock:InvokeModelWithResponseStream`

### 4. Run the Application

```bash
npm run dev
```

Navigate to `/agent` to start chatting with the AI agent!

## Features

- Real-time chat interface with message history
- Typing indicators and loading states
- Responsive design with proper message bubbles
- Error handling for API failures
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## API Endpoint

The chatbot uses the `/api/chat` endpoint which:

- Accepts POST requests with a `message` field
- Returns AI responses from AWS Bedrock
- Handles errors gracefully

## Customization

You can customize the AI model by changing the `modelId` in `/src/app/api/chat/route.js`. Available models include:

- `anthropic.claude-3-haiku-20240307-v1:0` (fast, cost-effective)
- `anthropic.claude-3-sonnet-20240229-v1:0` (balanced)
- `anthropic.claude-3-opus-20240229-v1:0` (most capable)

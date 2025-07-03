import ChatBox from "@hackathon/components/agent/ChatBox";

export default function AgentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Agent Chat
          </h1>
          <p className="text-lg text-gray-600">
            Chat with our AI agent powered by AWS Bedrock
          </p>
        </div>
        <ChatBox />
      </div>
    </div>
  );
}

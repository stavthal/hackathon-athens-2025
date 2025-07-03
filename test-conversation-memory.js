// Test script to verify conversation memory
// You can run this in your browser console to test the API

async function testConversationMemory() {
  console.log("🧪 Testing Conversation Memory...");

  // Test 1: Initial message
  console.log("\n📝 Test 1: Setting up context");
  const response1 = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message:
        "My name is Alex and I'm a software developer working on a React project.",
      conversationHistory: [],
    }),
  });
  const data1 = await response1.json();
  console.log("✅ Response 1:", data1.message);

  // Build conversation history
  const conversation = [
    {
      role: "user",
      content:
        "My name is Alex and I'm a software developer working on a React project.",
    },
    { role: "assistant", content: data1.message },
  ];

  // Test 2: Memory check
  console.log("\n🧠 Test 2: Checking memory");
  const response2 = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "What's my name and what am I working on?",
      conversationHistory: conversation,
    }),
  });
  const data2 = await response2.json();
  console.log("✅ Response 2:", data2.message);

  // Update conversation
  conversation.push(
    { role: "user", content: "What's my name and what am I working on?" },
    { role: "assistant", content: data2.message }
  );

  // Test 3: Context building
  console.log("\n🔗 Test 3: Building on context");
  const response3 = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Can you suggest some React best practices for my project?",
      conversationHistory: conversation,
    }),
  });
  const data3 = await response3.json();
  console.log("✅ Response 3:", data3.message);

  console.log("\n🎉 Conversation memory test completed!");
  console.log(
    "The AI should remember your name (Alex) and that you're working on a React project."
  );
}

// Run the test (uncomment the line below and run in browser console)
// testConversationMemory();

// Export for manual testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { testConversationMemory };
}

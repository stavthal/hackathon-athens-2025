"use client";

import { useState, useRef, useEffect } from "react";
import {
  LucideArrowUp,
  LucideBot,
  LucideUser,
  LucideTrash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ReactMarkdown from "react-markdown";

export default function ChatBox({ user_input }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextLoaded, setContextLoaded] = useState(false);
  const messagesEndRef = useRef(null); // Load conversation from localStorage on component mount
  useEffect(() => {
    const savedConversation = localStorage.getItem("chatConversation");

    if (savedConversation) {
      try {
        const parsedMessages = JSON.parse(savedConversation);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error loading saved conversation:", error);
      }
    }

    // Reset context loaded state on component mount since context is fresh each time
    setContextLoaded(false);
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatConversation", JSON.stringify(messages));
    }
  }, [messages]);

  // Reset context loaded state when user_input changes (fresh context each time)
  useEffect(() => {
    setContextLoaded(false);
  }, [user_input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to clear conversation history
  const clearConversation = () => {
    setMessages([]);
    setContextLoaded(false);
    localStorage.removeItem("chatConversation");
  };

  // Function to load context
  const loadContext = () => {
    if (user_input) {
      console.log("Loading context:", user_input.substring(0, 100) + "...");
      setContextLoaded(true);
    } else {
      console.log("No user_input provided");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Check if this is the first message before updating state
    const isFirstMessage = messages.length === 0;

    // Add user message to local state immediately
    const newUserMessage = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare conversation history for API call
      let conversationToSend = messages;

      // If context is loaded, include it in the conversation history
      if (contextLoaded && user_input) {
        console.log("Adding context to conversation");
        conversationToSend = [
          {
            role: "system",
            content: `Here is the context document that should be referenced throughout this conversation:\n\n${user_input}`,
          },
          ...messages,
        ];
      } else {
        console.log("Context not added:", {
          contextLoaded,
          hasUserInput: !!user_input,
        });
      }

      // Send current conversation history along with the new message
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationToSend, // Send the conversation history with context if applicable
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col border rounded-lg shadow-md bg-white border-neutral-800 w-3/5 max-w-4xl mx-auto my-4 h-[800px]">
      {/* Header with Load Context and Clear Button */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-700">AI Assistant</h3>
        <div className="flex gap-2">
          {!contextLoaded && user_input && (
            <Button
              onClick={loadContext}
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              Load Context
            </Button>
          )}
          {contextLoaded && (
            <span className="text-sm text-green-600 font-medium px-2 py-1 bg-green-50 rounded">
              Context Loaded
            </span>
          )}
          {messages.length > 0 && (
            <Button
              onClick={clearConversation}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LucideTrash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <LucideBot className="mx-auto mb-2 w-8 h-8" />
            <p>Start a conversation with the AI agent!</p>
            {user_input && !contextLoaded && (
              <p className="text-sm mt-2 text-blue-600">
                Click "Load Context" to include your document in the
                conversation.
              </p>
            )}
            {contextLoaded && (
              <p className="text-sm mt-2 text-green-600">
                Context document loaded and ready for reference.
              </p>
            )}
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex gap-2 ${
                message.role === "user"
                  ? "flex-row-reverse max-w-xs lg:max-w-md"
                  : "flex-row max-w-[150px] lg:max-w-[250px]"
              }`}
            >
              <div className="flex-shrink-0">
                {message.role === "user" ? (
                  <LucideUser className="w-6 h-6 text-neutral-600" />
                ) : (
                  <LucideBot className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-neutral-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.role === "user" ? (
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                ) : (
                  <div className="text-sm prose prose-sm">
                    <ReactMarkdown
                      components={{
                        // Custom styling for markdown elements
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold mb-2">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-md font-bold mb-2">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-bold mb-1">{children}</h3>
                        ),
                        code: ({ children, inline }) =>
                          inline ? (
                            <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto">
                              {children}
                            </code>
                          ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto mb-2">
                            {children}
                          </pre>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-2">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-2">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1">{children}</li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">
                            {children}
                          </blockquote>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex gap-2 max-w-xs lg:max-w-md">
              <div className="flex-shrink-0">
                <LucideBot className="w-6 h-6 text-green-600" />
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-end gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:border-none text-lg min-h-[40px] max-h-[120px]"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LucideArrowUp className="text-white" />
          </Button>
        </div>
      </form>
    </div>
  );
}

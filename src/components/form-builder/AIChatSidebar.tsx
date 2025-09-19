"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Sparkles, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "👋 Hi! I'm your Fomi AI assistant. I can help you:\n\n• Build better forms\n• Suggest improvements\n• Answer design questions\n• Optimize user experience\n\nWhat would you like to create today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        type: "assistant",
        content: "👋 Hi! I'm your Fomi AI assistant. I can help you:\n\n• Build better forms\n• Suggest improvements\n• Answer design questions\n• Optimize user experience\n\nWhat would you like to create today?",
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response with more contextual responses
    setTimeout(() => {
      const responses = [
        "Great question! 🎯 For better user engagement, consider:\n\n• Keep forms under 7 questions when possible\n• Group related questions together\n• Use clear, conversational language\n• Add helpful placeholder text",
        "Smart thinking! 📊 I suggest adding a progress indicator if your form has more than 5 questions. This helps users understand how much is left and reduces abandonment rates.",
        "Excellent approach! ✅ Making that field required is a good idea. You might also want to add validation messages to guide users when they make mistakes.",
        "Consider using conditional logic! 🔀 Show/hide questions based on previous answers. This creates a more personalized experience and keeps forms shorter.",
        "For better accessibility: ♿\n\n• Use clear labels for all fields\n• Ensure proper contrast ratios\n• Add ARIA labels where needed\n• Test with screen readers",
        "Pro tip! 💡 Try using different field types:\n\n• Rating scales for feedback\n• File uploads for documents\n• Date pickers for events\n• Multiple choice for quick selections",
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                AI Assistant
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  Online
                </Badge>
              </h3>
              <p className="text-xs text-gray-500">Form building expert</p>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4 min-h-full">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    message.type === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                      : "bg-gray-50 text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === "user" ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
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
                    <span className="text-xs text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about forms, design tips..."
            className="flex-1 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 cursor-text"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}

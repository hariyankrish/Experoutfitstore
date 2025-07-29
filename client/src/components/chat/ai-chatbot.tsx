import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm your EXPEROUTFIT assistant. I can help you with:\n\n• Product recommendations\n• Custom design advice\n• Order tracking\n• Size guides\n• General questions\n\nHow can I help you today?",
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [isOpen]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        sessionId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error) => {
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error('Chat error:', error);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const quickResponses = [
    "What's new this week?",
    "Help me design a t-shirt",
    "Track my order",
    "Size guide",
    "Shipping info",
  ];

  const handleQuickResponse = (response: string) => {
    setInputMessage(response);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-20 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={`bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 ${
            isOpen ? 'hidden' : 'block'
          }`}
        >
          <MessageCircle className="h-6 w-6" />
          {messages.length > 1 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
              {messages.filter(m => m.role === 'assistant').length - 1}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96">
          <Card className="shadow-2xl animate-slide-up">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <div className="relative">
                    <Bot className="h-5 w-5 text-blue-500" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-lg">EXPEROUTFIT Assistant</span>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-neutral-600">
                Online • Typically replies instantly
              </p>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                      </div>
                      <div className={`chat-bubble-${message.role}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 opacity-70 ${
                          message.role === 'user' ? 'text-blue-200' : 'text-neutral-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center">
                        <Bot className="h-3 w-3" />
                      </div>
                      <div className="bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="pulse-dot"></div>
                          <div className="pulse-dot"></div>
                          <div className="pulse-dot"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Responses */}
              {messages.length <= 1 && (
                <div className="px-4 py-2 border-t">
                  <p className="text-xs text-neutral-600 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-1">
                    {quickResponses.map((response, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickResponse(response)}
                        className="text-xs h-6 px-2"
                      >
                        {response}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={chatMutation.isPending}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={!inputMessage.trim() || chatMutation.isPending}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {chatMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                <p className="text-xs text-neutral-500 mt-2 text-center">
                  AI assistant • Powered by OpenAI
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

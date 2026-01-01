import { useState, useRef, useEffect, useCallback } from "react";

// ==================== CONFIGURATION ====================
const API_BASE_URL = "http://localhost:8000";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const APP_NAME = "AI Knowledge Assistant";

// ==================== TYPES ====================
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: Date;
}

interface ChatResponse {
  answer: string;
  sources: string[];
  success: boolean;
}

interface UploadResponse {
  success: boolean;
  message: string;
  filename?: string;
  page_count?: number;
  chunks_created?: number;
  already_exists?: boolean;
}

interface DocumentsResponse {
  success: boolean;
  documents: string[];
  count: number;
  error?: string;
}

// ==================== API FUNCTIONS ====================
async function sendChatMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, top_k: 3 }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      answer: "Sorry, I couldn't connect to the server. Please try again.",
      sources: [],
      success: false,
    };
  }
}

async function uploadDocument(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/upload-document`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload document",
    };
  }
}

async function getDocuments(): Promise<DocumentsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/documents`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error getting documents:", error);
    return {
      success: false,
      documents: [],
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==================== HOOKS ====================
function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () =>
    `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addMessage = useCallback(
    (role: "user" | "assistant", content: string, sources?: string[]) => {
      const newMessage: Message = {
        id: generateId(),
        role,
        content,
        sources,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      addMessage("user", content);
      setIsLoading(true);

      try {
        const response = await sendChatMessage(content);
        if (response.success) {
          addMessage("assistant", response.answer, response.sources);
        } else {
          addMessage("assistant", response.answer);
        }
      } catch (err) {
        addMessage(
          "assistant",
          "Sorry, something went wrong. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage]
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, sendMessage, clearMessages };
}

// ==================== COMPONENTS ====================
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%]`}>
        <div
          className={`flex items-start gap-3 ${
            isUser ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 ${
              isUser
                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                : "bg-gradient-to-br from-purple-500 to-indigo-600"
            }`}
          >
            {isUser ? "U" : "AI"}
          </div>

          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900 border border-gray-200"
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>

            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-300/50">
                <span className="text-xs text-gray-600 font-medium">
                  Sources:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {message.sources.map((source, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white/80 px-2 py-0.5 rounded border border-gray-300"
                    >
                      📄 {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`text-xs text-gray-500 mt-1 ${
            isUser ? "text-right mr-11" : "ml-11"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
        AI
      </div>
      <div className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

function DocumentUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      setUploadStatus("❌ Only PDF files are allowed");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus("❌ File too large (max 10MB)");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    setIsUploading(true);
    setUploadStatus("⏳ Uploading and processing...");

    try {
      const response = await uploadDocument(file);

      if (response.success) {
        setUploadStatus(`✅ ${response.message}`);
        onUploadSuccess();
        setTimeout(() => setUploadStatus(""), 5000);
      } else {
        setUploadStatus(`⚠️ ${response.message}`);
        setTimeout(() => setUploadStatus(""), 5000);
      }
    } catch (error) {
      setUploadStatus("❌ Upload failed");
      setTimeout(() => setUploadStatus(""), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileSelect(files[0]);
  };

  return (
    <div className="mb-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) =>
            e.target.files && handleFileSelect(e.target.files[0])
          }
          className="hidden"
          disabled={isUploading}
        />

        <div className="text-4xl mb-2">📄</div>
        <p className="text-gray-700 font-medium mb-1">
          {isUploading ? "Processing..." : "Upload PDF Document"}
        </p>
        <p className="text-sm text-gray-500">
          Drag & drop or click to select (Max 10MB)
        </p>
      </div>

      {uploadStatus && (
        <div className="mt-2 text-sm text-center text-gray-700 bg-gray-100 rounded-lg py-2 px-3 border border-gray-200">
          {uploadStatus}
        </div>
      )}
    </div>
  );
}

function DocumentsList({ refresh }: { refresh: number }) {
  const [documents, setDocuments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      const response = await getDocuments();
      if (response.success) setDocuments(response.documents);
      setIsLoading(false);
    };
    loadDocuments();
  }, [refresh]);

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-4">Loading documents...</div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg border border-gray-200">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Knowledge Base ({documents.length} documents)
      </h3>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {documents.map((doc, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2"
          >
            <span className="text-green-600">✓</span>
            <span className="text-gray-700 truncate">{doc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function ChatInterface() {
  const [inputText, setInputText] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [documentsRefresh, setDocumentsRefresh] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    if (!inputText.trim() || isLoading) return;
    const message = inputText;
    setInputText("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{APP_NAME}</h1>
              <p className="text-xs text-gray-500">
                Ask me anything from your documents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
            >
              {showUpload ? "Hide Upload" : "📄 Upload PDF"}
            </button>

            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-all"
              >
                Clear Chat
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex">
        <div className="max-w-6xl mx-auto w-full flex gap-4 p-4">
          {/* Sidebar */}
          {showUpload && (
            <aside className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-4 overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Documents
              </h2>

              <DocumentUpload
                onUploadSuccess={() => setDocumentsRefresh((prev) => prev + 1)}
              />

              <div className="mt-4">
                <DocumentsList refresh={documentsRefresh} />
              </div>
            </aside>
          )}

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200 flex items-center justify-center">
                    <span className="text-4xl">💬</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Start a Conversation
                  </h2>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Upload documents and ask questions. I'll help you find
                    answers from your knowledge base.
                  </p>

                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "What documents do you have?",
                      "Summarize the main points",
                      "Explain in simple terms",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInputText(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg border border-gray-200 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    rows={1}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ minHeight: "48px", maxHeight: "120px" }}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!inputText.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-sm"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

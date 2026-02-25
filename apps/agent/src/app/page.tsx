import { Metadata } from "next";
import { Sparkles, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agent | aizavseki.eu",
  description: "Chat with our custom AI Agent.",
};

export default function AgentPage() {
  return (
    <div className="flex min-h-screen bg-brand-dark text-brand-white overflow-hidden">
      <aside className="w-64 lg:w-72 border-r border-brand-white/5 hidden md:flex flex-col bg-brand-dark/50 backdrop-blur-md z-10">
        <div className="p-4 border-b border-brand-white/5 flex items-center justify-between">
          <h2 className="text-lg font-display font-medium text-brand-cyan flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Assistant
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-sm border border-dashed border-brand-white/10 text-brand-gray/60 italic rounded-xl p-4 text-center">
            No previous chats. History will magically appear here built from the
            OpenClaw state.
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(2,191,223,0.15),rgba(0,0,0,0))] pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center relative z-10">
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-20">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-cyan/20 to-brand-cyan/5 border border-brand-cyan/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,212,255,0.15)]">
              <Sparkles className="w-8 h-8 text-brand-cyan" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-brand-white via-brand-white to-brand-cyan/60">
              How can I help you today?
            </h1>
            <p className="text-brand-gray/80 text-lg">
              I am securely connected to the OpenClaw Agent. Ask me anything to
              get started.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6 w-full max-w-4xl mx-auto relative z-20 shrink-0">
          <div className="relative flex items-center bg-brand-navy/60 border border-brand-white/10 rounded-2xl shadow-2xl p-2 backdrop-blur-xl focus-within:ring-1 focus-within:ring-brand-cyan/50 focus-within:border-brand-cyan/50 transition-all">
            <textarea
              className="flex-1 bg-transparent border-none text-brand-white placeholder-brand-gray/50 resize-none max-h-32 min-h-[44px] px-4 py-3 focus:outline-none focus:ring-0"
              placeholder="Message your agent..."
              rows={1}
            />
            <button className="absolute right-3 bottom-2.5 bg-brand-cyan text-brand-dark rounded-xl p-2.5 hover:bg-brand-cyan/80 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <p className="text-xs text-brand-gray/40 text-center mt-3 font-medium">
            AI can make mistakes. Verified by OpenClaw Engine.
          </p>
        </div>
      </main>
    </div>
  );
}

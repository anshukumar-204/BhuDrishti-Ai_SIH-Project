import { useState } from "react";
import {
  ArrowUpRight,
  Bot,
  ChevronDown,
  ExternalLink,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { askAssistant } from "../../api/aiApi";
import { useLand } from "../../context/LandContext";

const suggestions = [
  "How do I search a land parcel?",
  "Find Dehradun research",
  "Explain this land",
  "Find datasets",
  "Explain risk",
  "How does BhuDrishti work?",
];

function AssistantMessage({ message }) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[90%] rounded-xl bg-emerald-100 px-3 py-2 text-sm leading-5 text-emerald-950">
        {message.text}
      </div>
    );
  }

  const data = message.data;
  return (
    <div className="max-w-[95%] space-y-3 rounded-xl bg-slate-100 px-3 py-3 text-sm leading-5 text-slate-700">
      <p>{message.text}</p>
      {data?.intent && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
          {data.intent.replaceAll("_", " ")}
        </p>
      )}
      {data?.results?.length > 0 && (
        <div className="space-y-2">
          {data.results.map((result) => (
            <div
              className="rounded-lg border border-slate-200 bg-white p-2.5"
              key={result.id || result.parcel_id || result.title}
            >
              <p className="font-bold text-slate-800">
                {result.title || result.parcel_id}
              </p>
              {result.title && (
                <p className="text-xs text-slate-500">
                  {result.type} {result.year ? `· ${result.year}` : ""}
                </p>
              )}
              {result.locality && (
                <p className="text-xs text-slate-500">
                  {result.locality} · {result.land_use} ·{" "}
                  {result.risk_level || "Risk unavailable"}
                </p>
              )}
              {result.source_url && (
                <a
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-blue-700"
                  href={result.source_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open source <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
      {data?.evidence?.length > 0 && (
        <div className="border-t border-slate-200 pt-2">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Evidence
          </p>
          {data.evidence.map((item) => (
            <p className="text-xs text-slate-600" key={item}>
              • {item}
            </p>
          ))}
        </div>
      )}
      {data?.actions?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.actions.map((action) => (
            <Link
              className="inline-flex items-center gap-1 rounded-lg bg-[#143b35] px-2.5 py-1.5 text-xs font-bold text-white"
              to={action.path}
              key={action.path}
            >
              {action.label} <ArrowUpRight className="h-3 w-3" />
            </Link>
          ))}
        </div>
      )}
      {data?.disclaimer && (
        <p className="border-t border-slate-200 pt-2 text-[11px] text-slate-500">
          {data.disclaimer}
        </p>
      )}
    </div>
  );
}

export default function BhuAssistant() {
  const { selectedParcel } = useLand();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! I am your land intelligence guide. I can help with parcels, GIS, research, datasets, analytics, and policy tools.",
    },
  ]);

  const ask = async (value = question) => {
    const cleanValue = value.trim();
    if (!cleanValue || loading) return;
    setQuestion("");
    setMessages((current) => [...current, { role: "user", text: cleanValue }]);
    setLoading(true);
    try {
      const { data } = await askAssistant(cleanValue, selectedParcel);
      setMessages((current) => [
        ...current,
        { role: "assistant", text: data.data.answer, data: data.data },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error.response?.data?.error ||
            "Assistant is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1000] sm:bottom-7 sm:right-7">
      {isOpen && (
        <div className="mb-3 flex w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#143b35] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#e7c76f]" />
              <div>
                <p className="text-sm font-bold">BhuDrishti Assistant</p>
                <p className="text-[11px] text-emerald-100/70">
                  Land intelligence guide
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[28rem] space-y-3 overflow-y-auto p-3">
            {messages.map((message, index) => (
              <AssistantMessage
                message={message}
                key={`${message.role}-${index}`}
              />
            ))}
            {loading && (
              <div className="max-w-[90%] rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
                Checking available evidence...
              </div>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto px-3 pb-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => ask(suggestion)}
                disabled={loading}
                className="shrink-0 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask();
            }}
            className="flex gap-2 border-t border-slate-100 p-3"
          >
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about land, research or BhuDrishti..."
              aria-label="Ask BhuDrishti Assistant"
              className="min-w-0 flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button
              aria-label="Send question"
              disabled={loading}
              className="rounded-lg bg-[#143b35] p-2 text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={
          isOpen ? "Close BhuDrishti Assistant" : "Open BhuDrishti Assistant"
        }
        className="group ml-auto flex items-center gap-2 rounded-full bg-[#143b35] p-2 text-white shadow-xl ring-4 ring-white transition hover:-translate-y-1"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e7c76f] text-[#143b35]">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="hidden pr-3 text-xs font-bold sm:block">
          Need help?
        </span>
        <ChevronDown
          className={`mr-1 hidden h-4 w-4 transition sm:block ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}

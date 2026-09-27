import { useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  BookOpen,
  ExternalLink,
  Map,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { askAssistant } from "../../api/aiApi";
import { useLand } from "../../context/LandContext";

const quickActions = [
  [
    "Explore Land",
    "Search parcels and GIS layers",
    "How do I search a land parcel?",
    Map,
  ],
  [
    "Find Research",
    "Find papers and datasets",
    "Find Dehradun research",
    BookOpen,
  ],
  [
    "View Analytics",
    "Understand land trends",
    "Show land-use analytics",
    BarChart3,
  ],
  ["AI Insights", "Explain land context", "Explain this land", Sparkles],
];

const suggestions = [
  "How do I select a parcel?",
  "Find Dehradun research",
  "Explain land risk",
  "Show land-use trends",
];

function getPageContext(pathname) {
  if (pathname.includes("land-explorer")) return "Land Explorer";
  if (pathname.includes("research")) return "Research Hub";
  if (pathname.includes("analytics")) return "Analytics";
  if (pathname.includes("policy-simulation")) return "Policy Simulation";
  if (pathname.includes("land-intelligence")) return "Land Intelligence";
  return "BhuDrishti platform";
}

function ResultPreview({ results, intent }) {
  if (!results?.length) return null;
  const preview = results.slice(0, 3);
  return (
    <div className="space-y-2">
      {intent?.includes("SEARCH") && (
        <p className="text-xs font-bold text-slate-500">
          Found {results.length} resource{results.length === 1 ? "" : "s"}
        </p>
      )}
      {preview.map((result, index) => (
        <div
          className="rounded-xl border border-slate-200 bg-white p-3"
          key={result.id || result.parcel_id || `${result.title}-${index}`}
        >
          <p className="font-bold text-slate-800">
            {result.title || result.parcel_id}
          </p>
          {result.title && (
            <p className="mt-0.5 text-xs text-slate-500">
              {result.type || "Resource"}{" "}
              {result.year ? `· ${result.year}` : ""}
            </p>
          )}
          {result.abstract && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-600">
              {result.abstract}
            </p>
          )}
          {result.locality && (
            <p className="mt-1 text-xs text-slate-500">
              {result.locality} · {result.land_use} ·{" "}
              {result.risk_level || "Risk unavailable"}
            </p>
          )}
          {result.source_url && (
            <a
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-700"
              href={result.source_url}
              target="_blank"
              rel="noreferrer"
            >
              Open source <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      ))}
      {results.length > preview.length && (
        <p className="text-xs text-slate-500">
          Showing the first {preview.length}. Open Research Hub for the complete
          catalog.
        </p>
      )}
    </div>
  );
}

function AssistantMessage({ message }) {
  if (message.role === "user")
    return (
      <div className="ml-auto max-w-[90%] rounded-2xl bg-emerald-100 px-3 py-2 text-sm leading-5 text-emerald-950">
        {message.text}
      </div>
    );
  const data = message.data;
  return (
    <div className="max-w-[95%] space-y-3 rounded-2xl bg-slate-100 px-3 py-3 text-sm leading-5 text-slate-700">
      <p>{message.text}</p>
      <ResultPreview results={data?.results} intent={data?.intent} />
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
    </div>
  );
}

export default function BhuAssistant() {
  const { selectedParcel } = useLand();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! 👋 I can help you explore land parcels, GIS layers, research, datasets, analytics, and policy tools.",
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

  const showWelcome = messages.length === 1;
  const pageContext = getPageContext(location.pathname);

  return (
    <div className="fixed bottom-5 right-5 z-[1000] sm:bottom-7 sm:right-7">
      {isOpen && (
        <div className="mb-3 flex w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#143b35] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#e7c76f]" />
              <div>
                <p className="text-sm font-bold">BhuDrishti Assistant</p>
                <p className="text-[11px] text-emerald-100/70">
                  Your Land Intelligence Guide
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-[10px] font-bold text-emerald-100">
                Online
              </span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                className="rounded-lg p-1 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="max-h-[30rem] space-y-3 overflow-y-auto p-3">
            <p className="text-[11px] font-semibold text-slate-400">
              Current page: {pageContext}
            </p>
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
            {showWelcome && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  What would you like to explore?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map(([label, description, prompt, Icon]) => (
                    <button
                      key={label}
                      onClick={() => ask(prompt)}
                      disabled={loading}
                      className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      <Icon className="h-5 w-5 text-emerald-700" />
                      <span className="mt-2 block text-xs font-bold text-slate-800">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-4 text-slate-500">
                        {description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-slate-100 px-3 py-2">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Try asking
            </p>
            <div className="flex gap-2 overflow-x-auto">
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
              placeholder="Ask about land, research, GIS or policy..."
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
          <p className="border-t border-slate-100 px-3 py-2 text-[10px] leading-4 text-slate-500">
            Insights use available datasets for decision support only. They do
            not provide legal ownership or official certification.
          </p>
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
      </button>
    </div>
  );
}

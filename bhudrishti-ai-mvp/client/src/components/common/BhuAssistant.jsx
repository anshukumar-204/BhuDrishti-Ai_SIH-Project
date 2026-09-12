import { useState } from "react";
import { Bot, ChevronDown, Send, Sparkles, X } from "lucide-react";

const suggestions = [
  "What can BhuDrishti do?",
  "How is soil moisture calculated?",
  "How do I analyze land?",
];

function answerQuestion(question) {
  const text = question.toLowerCase();
  if (text.includes("soil") || text.includes("moisture"))
    return "Soil moisture comes from Open-Meteo's 0–10 cm soil layer. BhuDrishti converts the live decimal value into a percentage and labels it Dry, Moderate, Good, or High moisture.";
  if (
    text.includes("analy") ||
    text.includes("coordinate") ||
    text.includes("land")
  )
    return "Open Land Intelligence, enter latitude and longitude, then choose Analyze land. You will get location, temperature, humidity, rainfall, weather, soil moisture, and 24-hour trends.";
  if (
    text.includes("future") ||
    text.includes("can") ||
    text.includes("feature")
  )
    return "BhuDrishti helps explore parcels, inspect risk layers, compare environmental signals, run policy scenarios, verify records, and discover research datasets.";
  if (
    text.includes("weather") ||
    text.includes("rain") ||
    text.includes("humidity")
  )
    return "Weather signals are fetched from Open-Meteo. The report shows current and average humidity, rainfall, temperature range, condition labels, and trend charts instead of raw arrays.";
  return "I can explain BhuDrishti features, land analysis, weather signals, soil moisture, map layers, research, and verification. Try one of the suggested questions.";
}

export default function BhuAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! I can help you understand BhuDrishti and your land report.",
    },
  ]);

  const ask = (value = question) => {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: cleanValue },
      { role: "assistant", text: answerQuestion(cleanValue) },
    ]);
    setQuestion("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1000] sm:bottom-7 sm:right-7">
      {isOpen && (
        <div className="mb-3 flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
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
          <div className="max-h-72 space-y-3 overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-5 ${message.role === "user" ? "ml-auto bg-emerald-100 text-emerald-950" : "bg-slate-100 text-slate-700"}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto px-3 pb-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => ask(suggestion)}
                className="shrink-0 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-700"
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
              placeholder="Ask about BhuDrishti..."
              aria-label="Ask BhuDrishti Assistant"
              className="min-w-0 flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button
              aria-label="Send question"
              className="rounded-lg bg-[#143b35] p-2 text-white hover:bg-emerald-800"
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

"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    num: "1",
    title: "Watch the ISS live",
    desc: "The globe on the main page shows the ISS position in real time, updating every 5 seconds. You can see the current country or ocean it is flying over, its altitude, and speed.",
  },
  {
    num: "2",
    title: "Enter your location and email",
    desc: "Fill in your city, country, and email address in the alert form. We only need your city, not your exact GPS coordinates.",
  },
  {
    num: "3",
    title: "Verify your email",
    desc: "We send a 6-digit code to your inbox. Enter it on screen to confirm you own the address. No code entered means no alert is set up.",
  },
  {
    num: "4",
    title: "Get notified when it passes",
    desc: "When the ISS enters the window above your city at night, you receive one email. That is it. Your data is then removed automatically. The email also contains a one-click cancel link in case you want to opt out before it arrives.",
  },
  {
    num: "5",
    title: "Step outside and look up",
    desc: "The ISS is visible to the naked eye and looks like a fast-moving bright star. No telescope needed. It typically takes 2 to 5 minutes to cross the sky.",
  },
];

const PRIVACY_ITEMS = [
  "We collect only your email address and city. No exact GPS, no phone number, no account required.",
  "Your data is used solely to send one alert and is deleted automatically once sent or cancelled.",
  "We do not sell, share, or use your data for any marketing or third-party purpose.",
  "Every alert email includes a one-click unsubscribe link. Cancellation takes effect immediately.",
  "All data is stored securely and encrypted in transit. See the Privacy Policy for full details.",
];

export default function HowItWorksModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-space-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1525] border border-accent/25 rounded-2xl w-[540px] max-w-[92vw] modal-scroll"
style={{ maxHeight: "88vh", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end px-5 pt-4">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white/[0.06] border border-white/10 text-text-secondary text-base flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
          >
            x
          </button>
        </div>

        <div className="px-8 pb-0 text-center">
          <p className="font-mono text-[11px] tracking-[2px] uppercase text-accent mb-2">
            Step by step
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary mb-5">
            How it works
          </h2>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`flex gap-4 py-4 ${
                  i < STEPS.length - 1 ? "border-b border-glow-blue/[0.08]" : ""
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center font-mono text-[12px] font-bold text-accent flex-shrink-0 mt-[2px]">
                  {step.num}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-text-primary mb-1">{step.title}</p>
                  <p className="text-[13px] text-text-secondary leading-[1.6]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-accent/[0.03] border border-accent/12 rounded-xl">
            <p className="font-mono text-[11px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-3">
              Your privacy
            </p>
            <div className="flex flex-col gap-2">
              {PRIVACY_ITEMS.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="w-1 h-1 rounded-full bg-accent mt-[7px] flex-shrink-0" />
                  <p className="text-[12px] text-text-muted leading-[1.6]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 p-3 bg-amber-500/[0.04] border border-amber-500/20 rounded-lg">
            <p className="text-[11px] text-amber-400/70 leading-[1.6]">
              <strong className="text-amber-400/90">Timing may not be perfectly exact,</strong>{" "}
ISS alerts are based on approximate location matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

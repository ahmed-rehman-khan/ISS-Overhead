import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ISS Overhead",
};

const SECTIONS = [
  {
    title: "What we collect",
    body: "When you sign up for an ISS overhead alert, we collect your name, email address, city name, and country. We do not collect your exact GPS coordinates, phone number, or any other personal information. We also collect the city-level coordinates resolved from your city name, used only to determine when the ISS is near your location.",
  },
  {
    title: "Why we collect it",
    body: "Your name is used to personalise the alert email. Your email address is used solely to send you the alert. Your city and country are used to determine your approximate location for the ISS proximity check. We have no other use for this data.",
  },
  {
    title: "How long we keep it",
    body: "You can request deletion of your data at any time by using the cancel link in your confirmation email or by visiting the Unsubscribe page. Unverified signups where the email code was never entered are cleared periodically.",
  },
  {
    title: "Who we share it with",
    body: "We do not sell, rent, or share your personal data with any third party for marketing or any other commercial purpose. Your data is processed by our infrastructure providers: Supabase (database hosting) and Google (email delivery via Gmail). Both are used solely to operate this service.",
  },
  {
    title: "Email communications",
    body: "You will receive a maximum of two emails from us: a one-time verification code email, and one alert email when the ISS is overhead at night. Every email includes a one-click unsubscribe link. Cancellation takes effect immediately. We will never send newsletters, promotions, or any unsolicited email.",
  },
  {
    title: "Data security",
    body: "All data is transmitted over HTTPS. Email addresses and location data are stored in a secured database with row-level security enabled. OTP verification codes are stored as hashed values only and expire after 15 minutes. API keys and credentials are never exposed in client-side code.",
  },
  {
    title: "Your rights",
    body: "You have the right to access, correct, or delete your personal data at any time. To cancel your alert and have your data removed, use the cancel link in your confirmation email or visit the Unsubscribe page.",
  },
  {
    title: "Cookies and tracking",
    body: "This website does not use cookies, analytics trackers, advertising pixels, or any third-party tracking scripts. We collect no data about how you browse or use this site.",
  },
  {
    title: "International users",
    body: "This service is available to users worldwide. Regardless of your location, we apply the same privacy standards to all users: minimal data collection, clear consent, easy opt-out, and no data sharing for commercial purposes.",
  },
  {
    title: "Disclaimer",
    body: "ISS Overhead is an independent personal project. It is not affiliated with, endorsed by, or connected to NASA, ESA, or any other space agency or organisation. ISS position data is sourced from the public Open Notify API. Alert timing may not be perfectly exact.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-space-black text-text-primary font-sans">
      <nav className="flex items-center justify-between px-10 py-[18px] border-b border-white/[0.06] bg-space-black/90">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="text-[18px] font-extrabold tracking-tight">
            ISS<span className="text-accent">OVERHEAD</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
        >
          Back to tracker
        </Link>
      </nav>

      <main className="max-w-[680px] mx-auto px-8 py-16">
        <p className="font-mono text-[11px] text-accent tracking-[2px] uppercase mb-3">
          Legal
        </p>
        <h1 className="text-[36px] font-extrabold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-[13px] text-text-muted mb-12 font-mono">
          Last updated: 26 June 2026
        </p>

        <p className="text-[15px] text-text-secondary leading-[1.7] mb-12">
          ISS Overhead is committed to protecting your privacy. This policy
          explains what personal data we collect, why we collect it, how long
          we keep it, and your rights regarding that data. We keep it plain and
          simple.
        </p>

        <div className="flex flex-col gap-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-[17px] font-bold text-text-primary mb-3">
                {s.title}
              </h2>
              <p className="text-[14px] text-text-secondary leading-[1.8]">
                {s.body}
              </p>
            </div>
          ))}

          <div>
            <h2 className="text-[17px] font-bold text-text-primary mb-3">
              Contact
            </h2>
            <p className="text-[14px] text-text-secondary leading-[1.8]">
              If you have any questions about this privacy policy or your
              personal data, you can reach Ahmed Rehman via his{" "}
              <a
                href="https://ahmedrehman.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                portfolio
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center px-10 py-6 border-t border-white/[0.06] mt-8">
        <p className="font-mono text-[10px] text-text-muted tracking-[1px]">
          ISSOVERHEAD · AHMED REHMAN · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
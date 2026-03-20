import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/scout" className="block mb-10">
        <span className="text-xl font-bold">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </span>
      </Link>

      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
        <p className="text-zinc-400">Last updated: March 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            What we collect
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Account info:</strong> Email
              address and name from Google OAuth.
            </li>
            <li>
              <strong className="text-white">Profile data:</strong> Resume text,
              target roles, locations, companies, skills, and salary preferences
              you provide during onboarding.
            </li>
            <li>
              <strong className="text-white">Billing:</strong> Payment
              processing is handled entirely by Stripe. We store only your
              Stripe customer ID — never your card details.
            </li>
            <li>
              <strong className="text-white">Digest history:</strong> A record
              of job digests sent to you (date and job count).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            How we use your data
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Your resume and preferences are sent to our AI (Claude by
              Anthropic) to match jobs and draft pitches. This happens
              server-side during each digest run.
            </li>
            <li>
              Your email is used to send job digests and account-related
              notifications only.
            </li>
            <li>We do not sell your data. Period.</li>
            <li>
              We do not share your resume or profile with employers, recruiters,
              or any third party.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            Data storage & security
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Data is stored in Supabase (PostgreSQL) with row-level security —
              you can only access your own data.
            </li>
            <li>All connections use HTTPS/TLS encryption.</li>
            <li>
              Authentication is handled via Supabase Auth with Google OAuth.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            Your rights
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Delete your account:</strong>{" "}
              Cancel your subscription and email us to delete all data.
            </li>
            <li>
              <strong className="text-white">Export your data:</strong> Contact
              us and we&apos;ll provide an export of your profile and digest
              history.
            </li>
            <li>
              <strong className="text-white">Update your profile:</strong> Edit
              anytime from your dashboard.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
          <p>
            Questions? Email{" "}
            <a
              href="mailto:support@jobscoutai.com"
              className="text-emerald-400 hover:text-emerald-300"
            >
              support@jobscoutai.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

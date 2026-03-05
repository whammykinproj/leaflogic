import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "LeafLogic privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: March 5, 2026</p>

      <div className="prose mt-8">
        <h2>Information We Collect</h2>
        <p>
          LeafLogic collects minimal data. If you subscribe to our newsletter,
          we collect your email address. We use standard analytics to understand
          how visitors use our site.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies for analytics and advertising purposes. Third-party
          services such as Google AdSense and Google Analytics may place cookies
          on your browser to serve relevant ads and measure traffic.
        </p>

        <h2>Advertising</h2>
        <p>
          LeafLogic uses Google AdSense to display advertisements. Google may
          use cookies to serve ads based on your prior visits to this or other
          websites. You can opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </p>

        <h2>Affiliate Links</h2>
        <p>
          Some links on LeafLogic are affiliate links. If you purchase a product
          through an affiliate link, we may earn a small commission at no extra
          cost to you. This helps support our free content.
        </p>

        <h2>Your Data</h2>
        <p>
          We do not sell your personal information. You can request deletion of
          your data by emailing{" "}
          <a href="mailto:hello@leaflogic.app">hello@leaflogic.app</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email us at{" "}
          <a href="mailto:hello@leaflogic.app">hello@leaflogic.app</a>.
        </p>
      </div>
    </div>
  );
}

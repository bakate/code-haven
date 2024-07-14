import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CodeHaven Terms of Service</h1>

      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using CodeHaven (the &quot;Service), you agree to be
          bound by these Terms of Service (&quot;Terms). If you disagree with
          any part of the terms, you may not access the Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          2. Description of Service
        </h2>
        <p>
          CodeHaven is a learning platform for future developers, providing
          educational content and resources.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
        <ul className="list-disc pl-5">
          <li>
            You need a Twitter/Google/Instagram or LinkedIn account to use the
            Service.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account.
          </li>
          <li>
            You agree to accept responsibility for all activities that occur
            under your account.
          </li>
        </ul>
      </section>

      {/* Add more sections as needed */}

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <address className="mt-2">
          CodeHaven
          <br />
          11, Place Lucie Aubrac
          <br />
          94600 Choisy Le Roi
          <br />
          France
          <br />
          <br />
          Owner: Bakate BA
        </address>
      </section>
    </div>
  );
};

export default TermsOfService;

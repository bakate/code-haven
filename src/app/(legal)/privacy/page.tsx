import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CodeHaven Privacy Policy</h1>

      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p>
          CodeHaven (&quot;we, &quot;our, or &quot;us) is committed to
          protecting your privacy. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our
          Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          2. Information We Collect
        </h2>
        <h3 className="text-xl font-medium mb-2">2.1. Personal Information</h3>
        <p>
          When you use our Service, we may collect personally identifiable
          information, such as your name and email address, provided through
          your Twitter account.
        </p>
        <h3 className="text-xl font-medium mb-2 mt-3">2.2. Usage Data</h3>
        <p>
          We may also collect information on how the Service is accessed and
          used.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          3. How We Use Your Information
        </h2>
        <p>We use the collected data for various purposes:</p>
        <ul className="list-disc pl-5">
          <li>To provide and maintain our Service</li>
          <li>To notify you about changes to our Service</li>
          <li>To provide customer support</li>
          <li>
            To gather analysis or valuable information so that we can improve
            our Service
          </li>
          <li>To monitor the usage of our Service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>
      </section>

      {/* Add more sections as needed */}

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us:
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

export default PrivacyPolicy;

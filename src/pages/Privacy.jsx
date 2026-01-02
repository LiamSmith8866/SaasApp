import React from "react";
export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-2 font-medium">Technology OCR</p>
      <p className="mb-2">Last Updated: January 2, 2026</p>
      <p className="mb-6">
        Website: <a href="https://technology-market.com" className="text-blue-600 underline">https://technology-market.com</a>
      </p>

      <p className="mb-6">
        Technology OCR (“we”, “our”, “us”) provides a cloud-based AI OCR SaaS platform serving users worldwide. 
        We are committed to protecting your privacy and complying with GDPR and other applicable data protection regulations.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Email address</li>
        <li>Name (optional)</li>
        <li>Uploaded images and documents for OCR</li>
        <li>Extracted text results</li>
        <li>IP address, device information, browser type and usage logs</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Data</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Provide OCR services</li>
        <li>Improve performance and user experience</li>
        <li>Manage subscriptions and billing</li>
        <li>Ensure system security</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Legal Basis (GDPR)</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Contract performance</li>
        <li>Legitimate interests</li>
        <li>User consent</li>
        <li>Legal obligations</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Data Retention</h2>
      <p className="mb-6">
        Uploaded files are deleted within 24 hours after processing unless required for legal or security purposes.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Payment Processing</h2>
      <p className="mb-6">
        Payments are handled by FastSpring (Merchant of Record). We do not store credit card or payment information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Your Rights</h2>
      <p>
        You have the right to access, correct, delete, or restrict the processing of your personal data. 
        You may also request data portability or withdraw consent at any time by contacting us.
      </p>
    </div>
  );
}

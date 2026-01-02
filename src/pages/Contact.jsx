import React from "react";
export default function Contact() {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
  
        <p className="mb-6">
          If you have any questions about Technology OCR, your account, billing, or data privacy, 
          please feel free to contact us using the information below.
        </p>
  
        <div className="bg-gray-50 border rounded-lg p-6 mb-10">
          <p className="font-semibold mb-2">Support Email</p>
          <p>
            <a href="mailto:admin@technology-market.com" className="text-blue-600 underline">
              admin@technology-market.com
            </a>
          </p>
        </div>
  
        <h2 className="text-xl font-semibold mb-3">Business Information</h2>
        <p className="mb-2">Product: Technology OCR</p>
        <p className="mb-2">Website: https://technology-market.com</p>
        <p className="mb-2">Service Type: Cloud-based AI OCR SaaS</p>
        <p className="mb-6">Service Area: Worldwide</p>
  
        <h2 className="text-xl font-semibold mb-3">Support Hours</h2>
        <p>
          Our support team typically responds to inquiries within 24–48 business hours.
        </p>
      </div>
    );
  }
  
"use client";

import Hero from "@/components/Hero";

export default function Home() {
  const handleInboxGeneration = () => {
    // TODO: Implement inbox generation logic
    console.log("Generating inbox...");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold">
          <span className="text-blue-400">Gen</span>mail
        </div>
        <div className="flex gap-4">
          <button className="text-gray-300 hover:text-white transition-colors">
            Upgrade
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <Hero onGenerateInbox={handleInboxGeneration} />

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-800">
        <p>&copy; 2024 Genmail. Privacy-first disposable email service.</p>
      </footer>
    </div>
  );
}

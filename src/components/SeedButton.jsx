"use client";

export default function SeedButton() {
  const handleSeed = async () => {
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });

      // Check if response has content before parsing
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        alert("Database seeded successfully!");
        console.log(data);
      } else {
        alert("Seeding failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error seeding database: " + error.message);
    }
  };

  return (
    <button
      onClick={handleSeed}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Seed Database
    </button>
  );
}

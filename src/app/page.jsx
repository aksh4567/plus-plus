import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-5xl mb-5 bg-linear-to-br from-[#007acc] to-[#4ec9b0] bg-clip-text text-transparent">
        Welcome to Code++
      </h1>

      <p className="text-lg text-gray-500 mb-10 max-w-xl">
        Master coding interviews with our curated problems and real-time code
        execution.
      </p>

      <Link href="/problems">
        <button className="px-8 py-4 text-lg bg-[#007acc] text-white rounded-lg font-semibold transition-colors duration-200 hover:bg-[#006ab3]">
          Start Solving Problems
        </button>
      </Link>
    </div>
  );
}

import Image from "next/image";

export default function Home() {
  return (
    <main className="h-screen flex relative">
      <div className="w-1/2 h-full bg-white hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center">
        <h2 className="text-3xl font-bold">Left Side</h2>
      </div>
      <div className="absolute left-1/2 h-full w-[1px] bg-gray-200"></div>
      <div className="w-1/2 h-full bg-white hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center">
        <h2 className="text-3xl font-bold">Right Side</h2>
      </div>
    </main>
  );
}

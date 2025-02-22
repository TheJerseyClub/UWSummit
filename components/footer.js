export default function Footer() {
  return (
    <footer className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="bg-black text-white px-12 py-6 rounded-lg mb-8 w-full h-full flex items-center justify-center">
            <span className="font-mono font-bold tracking-wider text-lg">The Jersey Club</span>
          </div>
          <p className="text-sm text-gray-600 font-mono">
            © {new Date().getFullYear()} UWCo-opium. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

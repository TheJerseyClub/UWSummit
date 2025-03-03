export default function Footer() {
  return (
    <footer className="w-full h-[100vh] sm:h-full py-6 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="bg-black text-white px-12 py-12 rounded-lg mb-8 w-full h-full flex items-center justify-center">
            <span className="font-mono font-bold tracking-wider text-lg">The Jersey Club</span>
          </div>
          <p className="text-sm text-gray-600 font-mono -mt-4 text-center">
            Not affiliated with the University of Waterloo.
          </p>
                  {/* Contact information in footer */}
        <div className="w-full max-w-5xl mx-auto px-4 py-3 mb-2">
          <p className="text-sm font-mono text-gray-700 text-center">
            For inquiries, contact us at: <a href="mailto:summitthesummit@gmail.com" className="font-bold text-yellow-600 hover:underline">summitthesummit@gmail.com</a>
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}

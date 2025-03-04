export default function Footer() {
  return (
    <footer className="w-full h-[100vh] sm:h-full py-6 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="bg-black text-white px-12 py-12 rounded-lg mb-8 w-full h-full flex flex-col items-center justify-center">
            <span className="font-mono font-bold tracking-wider text-lg">The Jersey Club</span>


            <div className="w-full max-w-5xl mx-auto px-4 py-2">
            <p className="text-sm font-mono text-gray-700 text-center">
              For inquiries, contact us at: <a href="mailto:summitthesummit@gmail.com" className="font-bold text-yellow-600 hover:underline">summitthesummit@gmail.com</a>
            </p>

            <p className="text-sm text-gray-600 font-mono text-center pt-2">
            Not affiliated with the University of Waterloo.
          </p>

          </div>
          </div>


        </div>
      </div>
    </footer>
  );
}

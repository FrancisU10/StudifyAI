
export default function Home() {
  return (
     <div className="relative grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      <div className="absolute top-4 right-4 flex gap-4">
        <button className="text-sm text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">
          Login
        </button>
        <button className="text-sm text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">
          Sign Up
        </button>
      </div>

      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center mt-20">
        <h1 className="text-4xl font-bold">Welcome to Studify AI</h1>
        <p className="text-lg text-gray-400">
          An AI-powered study assistant that transforms videos into study tools
        </p>
        <input
          id="video_url"
          type="text"
          className="w-full max-w-md p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          placeholder="Paste a video URL here"
        />
        <button className="w-full max-w-md p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 cursor-pointer">
          Generate Study Material
        </button>
      </main>
    </div>
  );
}

export default function LoadingScreen() {
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-white rounded-full animate-spin" />
        <p className="text-white text-lg font-semibold">Generating study material...</p>
      </div>
    </div>
    )
}
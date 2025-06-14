export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-4">Confirm Your Email</h1>
      <p className="text-zinc-400 max-w-md text-center mb-6">
          We have sent a confirmation link to your email. Please check your inbox and follow the link to activate your account.
      </p>
      <a href="/login" className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded">
        Back to Login
      </a>
    </div>
  );
}
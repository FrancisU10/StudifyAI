
export default function SignUp() {
    return (
      <>
       <form className="items-center justify-center flex flex-col">
            <input
                type="email"
                placeholder="Email"
                className="mb-4 p-2 border border-zinc-600 rounded w-64"
            />
            <input
                placeholder="Username"
                className="mb-4 p-2 border border-zinc-600 rounded w-64"
            />
            <input
                placeholder="Full Name"
                className="mb-4 p-2 border border-zinc-600 rounded w-64"
            />
            <input
                type="password"
                placeholder="Password"
                className="mb-4 p-2 border border-zinc-600 rounded w-64"
            />
            <button
                type="submit"
                className="w-64 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 cursor-pointer"
            >
                Sign Up
            </button>
        </form>
      </>  
    )
}
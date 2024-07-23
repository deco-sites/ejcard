import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const { error } = await ctx.state.supabaseClient.auth.signUp({
      email,
      password,
    });

    const headers = new Headers();

    let redirect = "/";
    if (error) {
      redirect = `/signup?error=${error.message}`;
    }

    headers.set("location", redirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

console.log(Deno.env.get("SUPABASE_URL"));

export default function SignUp(props: PageProps) {
  const err = props.url.searchParams.get("error");

  return (
    <section className="bg-gray-200 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-5 text-center">Create Account</h2>

        {err && (
          <div className="bg-red-400 border-l-4 border-red-600 p-4 mb-4">
            <p className="font-bold text-red-900">Error</p>
            <p>{err}</p>
          </div>
        )}

        <form className="space-y-4" method="POST">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="border border-gray-300 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 focus:outline-none"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="border border-gray-300 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
          >
            Create Account
          </button>
          <p className="text-sm font-light text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>

      {/* Estilos CSS */}
      <style>
        {`
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #BAE6FD;
        }

        .bg-white {
          background-color: #ffffff;
        }

        .bg-red-400 {
          background-color: #fc8181;
        }

        .border-red-600 {
          border-color: #ed2939;
        }

        .border-blue-600 {
          border-color: #3182ce;
        }

        .text-blue-600 {
          color: #3182ce;
        }

        .hover\:bg-blue-700:hover {
          background-color: #2c5282;
        }

        .focus\:ring-blue-600:focus {
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.5);
        }

        .focus\:outline-none:focus {
          outline: none;
        }

        .font-bold {
          font-weight: bold;
        }

        .font-medium {
          font-weight: 500;
        }

        .font-light {
          font-weight: 300;
        }

        .text-center {
          text-align: center;
        }

        .text-sm {
          font-size: 0.875rem;
        }

        .text-2xl {
          font-size: 1.75rem;
        }

        .rounded-lg {
          border-radius: 1rem;
        }

        .p-2.5 {
          padding: 2rem;
        }

        .mb-2 {
          margin-bottom: 0.5rem;
        }

        .mb-4 {
          margin-bottom: 1rem;
        }

        .p-4 {
          padding: 1rem;
        }

        .p-6 {
          padding: 1.5rem;
        }

        .p-8 {
          padding: 2rem;
        }

        .space-y-4 {
          margin-top: 1rem;
        }

        .sm\:text-sm {
          font-size: 0.875rem;
        }

        .w-full {
          width: 100%;
        }

        .max-w-md {
          max-width: 40rem;
        }

        .shadow-md {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .hover\:underline:hover {
          text-decoration: underline;
        }

        .border {
          border-width: 1px;
        }

        .flex {
          display: flex;
        }

        .flex-col {
          flex-direction: column;
        }

        .items-center {
          align-items: center;
        }

        .justify-center {
          justify-content: center;
        }

        .min-h-screen {
          min-height: 100vh;
        }

        .bg-blue-600 {
          background-color: #3182ce;
        }

        .text-white {
          color: #ffffff;
        }
      `}
      </style>
    </section>
  );
}

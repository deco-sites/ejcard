
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";


export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const name = form.get("name") as string;
    const phone = form.get("phone") as string;
    const balance = form.get("balance") as string;

    const cardId = generateCardId();

 
    const { data, error } = await ctx.state.supabaseClient
      .from("cards")
      .insert([{ id: cardId, name, phone: phone, balance: Number(balance) }]);


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
  }
}


function generateCardId(): string {
  return `card-${Date.now()}`;
}


export default function SignUp(props: PageProps) {
  const err = props.url.searchParams.get("error");

  return (
    <section className="bg-gray-200">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="mx-auto">
          <h2 className="text-2xl font-bold mb-5 text-center">Create Debit Card</h2>
        </div>

        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {err && (
              <div className="bg-red-400 border-l-4 p-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{err}</p>
              </div>
            )}
            <form className="space-y-4 md:space-y-6" method="POST">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
                <input type="text" name="name" id="name" className="border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium">Phone Number</label>
                <input type="tel" name="phone" id="phone" className="border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-456-7890" />
              </div>
              <div>
                <label htmlFor="balance" className="block mb-2 text-sm font-medium">Balance</label>
                <input type="number" name="balance" id="balance" className="border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="100.00" />
              </div>
              
              <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Card</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

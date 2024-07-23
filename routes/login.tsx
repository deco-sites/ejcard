import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import { setCookie } from "../routes/cookie.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const { data, error } = await ctx.state.supabaseClient.auth
      .signInWithPassword({ email, password });

    const headers = new Headers();

    if (data.session) {
      setCookie(headers, {
        name: "supaLogin",
        value: data.session?.access_token,
        maxAge: data.session.expires_in,
      });
    }

    let redirect = "/menu";
    if (error) {
      redirect = `/login?error=${error.message}`;
    }

    headers.set("location", redirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function Login(props: PageProps) {
  const err = props.url.searchParams.get("error");

  return (
    <Layout isLoggedIn={false}>
      <div className="container">
        <div className="logo-box">
          <img src="image.png" alt="Logo" className="logo" />
        </div>
        <div className="message-box">
          <h1 className="title">Login</h1>
          {err && (
            <div className="error-message">
              <p className="font-bold">Error</p>
              <p>{err}</p>
            </div>
          )}
          <form className="space-y-4" method="POST">
            <div className="form-group">
              <label htmlFor="email" className="label">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="input"
                placeholder="name@company.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="label">Senha</label>
              <input
                type="password"
                name="password"
                id="password"
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="button"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <style jsx>
        {`
  /* Estilo geral do corpo */
  body {
    background-color: rgba(139, 0, 4, 0.8); 
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }

  /* Contêiner principal */
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0 10px;
  }

  /* Caixa da logo */
  .logo-box {
    margin-bottom: 30px;
    margin-top: -100px;
  }

  /* Estilo da logo */
  .logo {
    max-width: 200px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: 14px;
  }

  /* Caixa da mensagem */
  .message-box {
    text-align: left; /* Alinhamento à esquerda do conteúdo */
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 440px;
    width: 100%;
  }

  /* Título da mensagem */
  .title {
    text-align: center; /* Centraliza apenas o título */
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #000000;
  }

  /* Mensagem de erro */
  .error-message {
    background-color: #fddede;
    border-left: 4px solid #d32f2f;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    color: #b71c1c;
  }

  /* Grupo do formulário */
  .form-group {
    display: flex;
    flex-direction: column; /* Ajuste para alinhamento vertical */
    margin-bottom: 1rem; /* Ajuste a margem entre os grupos do formulário */
  }

  /* Estilo dos labels do formulário */
  .label {
    font-weight: bold;
    font-size: 1rem; /* Ajuste o tamanho da fonte */
    margin-bottom: 0.5rem; /* Espaçamento inferior do rótulo */
    text-align: left; /* Alinhamento à esquerda */
  }

  /* Estilo dos campos de entrada */
  .input {
    height: 2.5rem; /* Altura dos campos de entrada */
    padding: 0 1rem; /* Padding interno */
    border-width: 2px; /* Largura da borda */
    border-radius: 0.375rem; /* Arredondamento da borda */
    border-color: #d1d5db; /* Cor da borda */
  }
  
  /* Estilo do botão de submit */
  button[type="submit"] {
    height: 50px; /* Altura aumentada */
    padding: 0 16px; /* Aumento do padding interno */
    border-radius: 6rem;
    background-color: #2D2D2D;
    color: #ffffff;
    font-size: 18px;
    font-weight: 400;
  }

  /* Estilo do botão */
  .button {
    color: #ffffff;
    background-color: #2D2D2D;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 400;
    text-decoration: none;
    display: inline-block;
    width: calc(20% - 8px);
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  /* Estilo do botão ao passar o mouse */
  .button:hover {
    background-color: #3C0F15;
  }

  /* Estilo do botão ao focar */
  .button:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(253, 224, 71, 0.5);
  }

  /* Estilo para espaço entre elementos */
  .space-y-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(1rem * var(--tw-space-y-reverse));
  }

  /* Estilos de formatação e foco */
  .focus\:ring-2:focus {
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.5);
  }
  
  .focus\:outline-none:focus {
    outline: none;
  }

  .text-sm {
    font-size: 0.875rem;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .w-full {
    width: 100%;
  }

  .p-2.5 {
    padding: 0.625rem;
  }

  .sm\:text-sm {
    font-size: 0.875rem;
  }
`}
      </style>
    </Layout>
  );
}

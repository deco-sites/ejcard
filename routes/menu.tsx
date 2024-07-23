import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import { State } from "./_middleware.ts";

export const handler: Handlers<any, State> = {
  GET(_req, ctx) {
    return ctx.render({ ...ctx.state });
  },
};

export default function Home(props: PageProps) {
  return (
    <Layout isLoggedIn={props.data.token}>
      <div className="container">
        {props.data.token
          ? (
            <div className="message-box">
              <h1>Cartão:</h1>
              <a href="/cadastra" className="button">Cadastrar Cartão</a>
              <a href="/consulta" className="button">Consultar Saldo</a>
              <a href="/recarga" className="button">Recarregar Cartão</a>
              <a href="/venda" className="button">Realizar Venda</a>
              <h1>Controle:</h1>
              <a href="/produtos" className="button">Cadastrar Produto</a>
              <a href="/listaProdutos" className="button">Consultar Produtos</a>
              <a href="/financas" className="button">Registro Financeiro</a>
              <a href="/logout" className="button">Logout</a>
            </div>
          )
          : (
            <>
            </>
          )}
      </div>
      <style jsx>
        {`
        body {
          background-color: rgba(139, 0, 4, 0.8); 
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 0 10px; /* Ajuste de padding */
        }

        .logo-box {
          margin-bottom: 30px;
          margin-top: -100px; /* Margem para separar a logo do conteúdo */
        }

        .logo {
          max-width: 200px;
          display: block;
          margin-left: auto;
          margin-right: auto;
          margin-top: -50px;
          border-radius: 14px;
        }

        .message-box {
          text-align: center;
          background-color: #ffffff; /* Cor branca para contraste */
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 640px;
          width: 100%;
        }

        .message-box h1 {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #000000; /* Texto em preto */
        }

        .button {
          color: #ffffff; /* Texto branco */
          background-color: #2D2D2D; /* Cinza escuro */
          padding: 12px 2px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          width: calc(100% - 16px); /* Ajuste de largura */
          text-align: center;
          margin-bottom: 12px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #3C0F15; /* Tom vinho mais escuro para hover */
        }

        .button:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(253, 224, 71, 0.5); /* Cor amarela clara */
        }
      `}
      </style>
    </Layout>
  );
}

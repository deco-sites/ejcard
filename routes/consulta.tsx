import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

export type Card = {
  name: string;
  phone: string;
  card_number: string;
  balance: number;
};

type QueryCardResponse = {
  card?: Card;
  errorMessage?: string;
};

export const handler: Handlers<any, QueryCardResponse> = {
  GET: async (req: Request, ctx: HandlerContext<QueryCardResponse>) => {
    const url = new URL(req.url);
    const cardNumber = url.searchParams.get("card_number");

    if (!cardNumber) {
      return ctx.render({
        errorMessage: "Você deve fornecer um número de cartão",
      });
    }

    const client = createClient(
      "https://bcqocegiolbnjypvtmjp.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcW9jZWdpb2xibmp5cHZ0bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDQxNjksImV4cCI6MjAzNDU4MDE2OX0.pe6jTzbxhpYVEubqqtwPSM8wwSZTBSGpG10tpjcc3mE",
    );

    const { data, error } = await client
      .from("cards")
      .select("name, phone, card_number, balance")
      .eq("card_number", cardNumber)
      .single();

    if (error && !data) {
      return ctx.render({ errorMessage: "Cartão não encontrado" });
    }

    if (error) {
      return ctx.render({ errorMessage: "erro" });
    }

    if (!data) {
      return ctx.render({ errorMessage: "Cartão não encontrado" });
    }

    const card = data as Card;
    return ctx.render({ card });
  },
};

const ConsultaCard = (props: PageProps<QueryCardResponse>) => {
  const { card, errorMessage } = props.data || {};

  const hasError = !!errorMessage;
  const hasCard = !!card && !hasError;

  const formatBalance = (balance: number) => {
    return (balance / 100.0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="container">
      <div className="message-box">
        {hasCard && (
          <div className="card-info">
            <span className="text-center p-4">
              {`Nome: ${card?.name}, Saldo: ${formatBalance(card?.balance)}`}
            </span>
          </div>
        )}
        {hasError && (
          <div className="error-message">
            <span>{props.data?.errorMessage}</span>
          </div>
        )}
      </div>
      <div className="form-container">
        <h1>Consulta</h1>
        <form method="GET">
          <div className="form-group">
            <label htmlFor="card_number">Número do Cartão</label>
            <input
              type="number"
              name="card_number"
              id="card_number"
              className="input-field"
              placeholder="ex: 169"
              required
            />
          </div>
          <div className="button-container">
            <button
              type="submit"
              className="button-primary"
            >
              Consultar
            </button>
          </div>
          <div className="button-container">
            <a
              href="/"
              className="button-primary"
            >
              Voltar
            </a>
          </div>
        </form>
      </div>
      <style jsx>
        {`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: rgba(220, 100, 100, 0.95); 
          padding: 16px;
        }

        .form-container {
          background-color: #FFFFFF;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          margin-bottom: 30px;
        }

        h1 {
          margin-bottom: 16px;
          font-size: 24px;
          text-align: center;
          color: #111827;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .footer-buttons {
          display: flex;
          justify-content: center;
          margin-top: 16px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 16px;
          color: #111827;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          margin-left: -5px;
        }

        .input-field:focus {
          border-color: #3B82F6;
          outline: none;
        }

        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        .button-primary {
          padding: 12px 24px;
          font-size: 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: #4B5563;
          color: #FFFFFF;
          transition: background-color 0.3s ease;
          margin-right: 10px;
          margin-top: 10px;
          text-decoration: none;
        }

        .button-primary:hover {
          background-color: #6B7280;
        }

        .message-box {
          width: 100%;
          max-width: 400px;
          margin-bottom: 20px;
        }

        .card-info {
          background-color: #d4edda;
          color: #155724;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #C3E6CB;
          margin-bottom: 16px;
          text-align: center;
        }

        .error-message {
          background-color: #F8D7DA;
          color: #721C24;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #F5C6CB;
          text-align: center;
        }
        
      `}
      </style>
    </div>
  );
};

export default ConsultaCard;

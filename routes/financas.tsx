import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

export type Card = {
  name: string;
  phone: string;
  card_number: string;
  balance: number;
};

type NegativeBalanceCardsResponse = {
  cards?: Card[];
  errorMessage?: string;
};

export const handler: Handlers<any, NegativeBalanceCardsResponse> = {
  GET: async (
    req: Request,
    ctx: HandlerContext<NegativeBalanceCardsResponse>,
  ) => {
    const client = createClient(
      "https://bcqocegiolbnjypvtmjp.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcW9jZWdpb2xibmp5cHZ0bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDQxNjksImV4cCI6MjAzNDU4MDE2OX0.pe6jTzbxhpYVEubqqtwPSM8wwSZTBSGpG10tpjcc3mE",
    );

    const { data, error } = await client
      .from("cards")
      .select("name, phone, card_number, balance")
      .lt("balance", 0);

    if (error) {
      return ctx.render({
        errorMessage: "Erro ao buscar cartões com saldo negativo",
      });
    }

    if (!data || data.length === 0) {
      return ctx.render({
        errorMessage: "Nenhum cartão com saldo negativo encontrado",
      });
    }

    return ctx.render({ cards: data });
  },
};

const NegativeBalanceCards = (
  props: PageProps<NegativeBalanceCardsResponse>,
) => {
  const { cards, errorMessage } = props.data || {};

  const formatBalance = (balance: number) => {
    return (balance / 100.0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="container">
      <h1>Cartões com Saldo Negativo</h1>
      {errorMessage && (
        <div className="error-message">
          <span>{errorMessage}</span>
        </div>
      )}
      {cards && cards.length > 0 && (
        <ul>
          {cards.map((card) => (
            <li key={card.card_number} className="card-item">
              <span>
                {`Nome: ${card.name}, Telefone: ${card.phone}, Saldo: ${
                  formatBalance(card.balance)
                }`}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="button-secondary-container">
        <a
          href="/"
          className="button-primary"
        >
          Voltar
        </a>
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

        h1 {
          margin-bottom: 16px;
          font-size: 24px;
          text-align: center;
          color: #111827;
        }

        .error-message {
          color: red;
          margin-bottom: 16px;
        }

        .card-item {
          background-color: #FFFFFF;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 10px;
          width: 100%;
          max-width: 400px;
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
        }

        .button-primary:hover {
          background-color: #6B7280;
        }

        .button-secondary-container {
          display: flex;
          justify-content: center;
          margin-top: 16px;
        }
      `}
      </style>
    </div>
  );
};

export default NegativeBalanceCards;

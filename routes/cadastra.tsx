import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import RealInput from "../islands/RealInput.tsx";

export type Card = {
  name: string;
  phone: string;
  card_number: string;
  balance: number;
};

type CreatedCardResponse = {
  card: Card;
  errorMessage?: string;
};

export const handler: Handlers<any, CreatedCardResponse> = {
  POST: async (req: Request, _ctx: HandlerContext<CreatedCardResponse>) => {
    const client = createClient(
      "https://bcqocegiolbnjypvtmjp.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcW9jZWdpb2xibmp5cHZ0bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDQxNjksImV4cCI6MjAzNDU4MDE2OX0.pe6jTzbxhpYVEubqqtwPSM8wwSZTBSGpG10tpjcc3mE",
    );

    const body = await req.formData();
    const bodyAsJson = Object.fromEntries(body.entries()) as {
      name: string;
      balance: string;
      card_number: string;
      phone: string;
    };

    const card = {
      ...bodyAsJson,
      balance: parseFloat(
        bodyAsJson.balance?.replace("R$ ", "").replace(",", "."),
      ),
    };

    const { data: existingCards, error: fetchError } = await client
      .from("cards")
      .select("card_number")
      .eq("card_number", card.card_number);

    if (fetchError) {
      return _ctx.render({
        errorMessage: `Erro ao verificar cartão: ${fetchError.message}`,
        card,
      });
    }

    if (existingCards && existingCards.length > 0) {
      return _ctx.render({
        errorMessage: `Cartão ${card.card_number} já cadastrado.`,
        card,
      });
    }

    const { data, error } = await client.from("cards").insert(card).select();

    if (error) {
      return _ctx.render({
        errorMessage: `Ocorreu um erro ao salvar o cartão: ${error.message}`,
        card,
      });
    }

    const createdCard = data[0] as Card;

    return _ctx.render({ card: createdCard });
  },
};

export default function NewCard(props: PageProps<CreatedCardResponse>) {
  const hasError = !!props?.data?.errorMessage;
  const hasSuccess = !!props?.data?.card && !hasError;

  return (
    <div className="container">
      <div className="message-box">
        {hasSuccess && (
          <div className="success-message">
            <h2>Cartão Cadastrado com Sucesso!</h2>
            <div className="card-info">
              <p>
                <strong>Número do Cartão:</strong> {props.data.card.card_number}
              </p>
              <p>
                <strong>Nome:</strong> {props.data.card.name}
              </p>
              <p>
                <strong>Telefone:</strong> {props.data.card.phone}
              </p>
              <p>
                <strong>Saldo Atual:</strong> R${" "}
                {(props.data.card.balance / 100).toFixed(2)}
              </p>
            </div>
          </div>
        )}
        {hasError && (
          <div className="error-message">
            <span>{props.data?.errorMessage}</span>
          </div>
        )}
      </div>

      <div className="form-container">
        <h1>Criar Cartão</h1>
        <form method="POST">
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              name="name"
              id="name"
              className="input-field"
              placeholder="ex: Maria das Graças"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="card_number">Número do Cartão*</label>
            <input
              type="number"
              name="card_number"
              id="card_number"
              className="input-field"
              placeholder="ex: 169"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Celular</label>
            <input
              name="phone"
              id="phone"
              className="input-field"
              value="(83) 9"
            />
          </div>
          <div className="form-group">
            <label htmlFor="balance">Crédito Inicial</label>
            <RealInput
              name="balance"
              id="balance"
              classes="input-field"
            />
          </div>
          <div className="button-container">
            <button
              type="submit"
              className="button-primary"
            >
              Cadastrar
            </button>
          </div>
          <div className="button-container">
            <a
              href="/menu"
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
    border-radius: 12px;
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

  .submit-button, .back-button, .sale-button {
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-align: center;
    display: inline-block;
    margin: 5px; /* Adiciona espaçamento uniforme entre os botões */
  }

  .submit-button {
    background-color: #4B5563;
    color: #FFFFFF;
  }

  .submit-button:hover {
    background-color: #6B7280;
  }

  .back-button {
    background-color: #D1D5DB;
    color: #111827;
  }

  .back-button:hover {
    background-color: #B1B5B9;
  }

  .sale-button {
    background-color: #3B82F6;
    color: #FFFFFF;
  }

  .sale-button:hover {
    background-color: #2563EB;
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

  .success-message {
    background-color: #d4edda;
    color: #155724;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #c3e6cb;
    margin-bottom: 16px;
  }

  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #f5c6cb;
  }

  .card-info {
    margin-top: 10px;
  }

  .card-info p {
    margin: 8px 0;
  }

`}
      </style>
    </div>
  );
}

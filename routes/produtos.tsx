import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { h } from "preact";

export type Product = {
  produto: string;
  preço: number;
  vendidos: number;
  created_at?: string;
};

type CreatedProductResponse = {
  product?: Product;
  errorMessage?: string;
};

// Handler para lidar com a requisição POST
export const handler: Handlers<CreatedProductResponse> = {
  POST: async (req: Request, _ctx: HandlerContext<CreatedProductResponse>) => {
    const client = createClient(
      "https://bcqocegiolbnjypvtmjp.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcW9jZWdpb2xibmp5cHZ0bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDQxNjksImV4cCI6MjAzNDU4MDE2OX0.pe6jTzbxhpYVEubqqtwPSM8wwSZTBSGpG10tpjcc3mE",
    );

    const body = await req.formData();
    const bodyAsJson = Object.fromEntries(body.entries()) as {
      produto: string;
      preço: string;
    };

    if (bodyAsJson.produto?.length < 2) {
      return _ctx.render(
        { errorMessage: "Você deve preencher o valor do nome do produto" },
        { status: 400 },
      );
    }

    const preço = parseFloat(bodyAsJson.preço.replace(",", ".")) * 100;

    const product = {
      produto: bodyAsJson.produto,
      preço,
      vendidos: 0,
      created_at: new Date().toISOString(),
    };

    const { data: existingCards, error: fetchError } = await client
      .from("produtos")
      .select("produto")
      .eq("produto", product.produto);

    if (fetchError) {
      return _ctx.render({
        errorMessage: `Erro ao verificar produto: ${fetchError.message}`,
        product,
      });
    }
    if (existingCards && existingCards.length > 0) {
      return _ctx.render({
        errorMessage:
          `Erro: Produto ${product.produto} já cadastrado. Mude o nome se necessário, pois não é permitido dois produtos com mesmo nome.`,
        product,
      });
    }

    const { data, error } = await client.from("produtos").insert(product)
      .select();

    if (error) {
      return _ctx.render({
        errorMessage: `Ocorreu um erro ao salvar o produto: ${error.message}`,
        product,
      });
    }

    const createdProduct = data[0] as Product;

    return _ctx.render({ product: createdProduct });
  },
};

export default function NewProduct(props: PageProps<CreatedProductResponse>) {
  const hasError = !!props?.data?.errorMessage;
  const hasSuccess = !!props?.data?.product && !hasError;

  return (
    <div className="container">
      <div className="message-box">
        {hasSuccess && props.data?.product && (
          <div className="success-message">
            <h2>Produto Cadastrado com Sucesso!</h2>
            <div className="product-info">
              <p>
                <strong>Nome do Produto:</strong> {props.data.product.produto}
              </p>
              <p>
                <strong>Preço:</strong> R${" "}
                {(props.data.product.preço / 100).toFixed(2)}
              </p>
              <p>
                <strong>Vendidos:</strong> {props.data.product.vendidos}
              </p>
              <p>
                <strong>Data de Criação:</strong> {props.data.product.created_at}
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
        <h1>Cadastrar Produto</h1>
        <form method="POST">
          <div className="form-group">
            <label htmlFor="produto">Nome do Produto</label>
            <input
              type="text"
              name="produto"
              id="produto"
              className="input-field"
              placeholder="ex: Produto A"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="preço">Preço</label>
            <input
              type="text"
              name="preço"
              id="preço"
              className="input-field"
              placeholder="ex: 2,50"
              required
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
            <a href="/menu" className="button-primary">Voltar</a>
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

        .message-box {
          margin-bottom: 20px;
        }

        .success-message, .error-message {
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 16px;
        }

        .success-message {
          background-color: #D1FAE5;
          border: 1px solid #4ADE80;
          color: #065F46;
        }

        .product-info p {
          margin: 8px 0;
          font-size: 16px;
        }

        .error-message {
          background-color: #FEE2E2;
          border: 1px solid #F87171;
          color: #B91C1C;
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
          margin-left: -8px;
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
          text-decoration: none;
          text-align: center;
        }

        .button-primary:hover {
          background-color: #6B7280;
        }
      `}
      </style>
    </div>
  );
}

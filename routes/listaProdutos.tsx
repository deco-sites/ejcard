import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Tipo do produto
export type Product = {
  id: number;
  produto: string;
  preço: number;
  vendidos: number;
  created_at?: string;
};

type ProductsResponse = {
  products: Product[];
  errorMessage?: string;
};

export const handler: Handlers<any, ProductsResponse> = {
  GET: async (_req: Request, ctx: HandlerContext<ProductsResponse>) => {
    const client = createClient(
      "https://bcqocegiolbnjypvtmjp.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcW9jZWdpb2xibmp5cHZ0bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDQxNjksImV4cCI6MjAzNDU4MDE2OX0.pe6jTzbxhpYVEubqqtwPSM8wwSZTBSGpG10tpjcc3mE",
    );

    const { data, error } = await client
      .from("produtos")
      .select("id, produto, preço, vendidos, created_at");

    if (error) {
      return ctx.render({
        errorMessage: `Erro na consulta: ${error.message}`,
        products: [],
      });
    }

    if (!data) {
      return ctx.render({
        errorMessage: "Nenhum produto encontrado",
        products: [],
      });
    }

    // Verificar se os dados recebidos são do tipo esperado
    const products: Product[] = (data as any[]).filter((
      item,
    ): item is Product =>
      typeof item.id === "number" &&
      typeof item.produto === "string" &&
      typeof item.preço === "number" &&
      typeof item.vendidos === "number"
    );

    return ctx.render({ products, errorMessage: undefined });
  },

  POST: async (req: Request, ctx: HandlerContext<ProductsResponse>) => {
    const client = createClient(
      "https://bcqocegiolbnjypvtmjp.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcW9jZWdpb2xibmp5cHZ0bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDQxNjksImV4cCI6MjAzNDU4MDE2OX0.pe6jTzbxhpYVEubqqtwPSM8wwSZTBSGpG10tpjcc3mE",
    );

    const body = await req.formData();
    const bodyAsJson = Object.fromEntries(body.entries()) as {
      produto: string;
      preço: string;
    };

    if (bodyAsJson.produto?.length < 3) {
      return ctx.render(
        {
          errorMessage: "Você deve preencher o valor do nome do produto",
          products: [],
        },
        { status: 400 },
      );
    }

    const product = {
      produto: bodyAsJson.produto,
      preço: parseFloat(bodyAsJson.preço),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from("produtos")
      .insert(product)
      .select();

    if (error) {
      return ctx.render({
        errorMessage: `Erro ao salvar o produto: ${error.message}`,
        products: [],
      });
    }

    const createdProduct = data?.[0] as Product;

    return ctx.render({ products: [createdProduct], errorMessage: undefined });
  },
};

export default function ProductsPage(props: PageProps<ProductsResponse>) {
  const { products, errorMessage } = props.data;

  // Calcula o total vendido
  const totalVendido = products.reduce(
    (total, product) => total + product.preço * product.vendidos,
    0,
  );

  return (
    <div className="products-page">
      <a href="/menu" className="back-button">Voltar</a>
      <h1>Lista de Produtos</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul className="products-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <h2 className="product-name">{product.produto}</h2>
            <p className="product-price">
              Preço: R$ {(product.preço / 100).toFixed(2)}
            </p>
            <p className="product-sold">Vendidos: {product.vendidos}</p>
          </li>
        ))}
      </ul>
      <div className="total-sold">
        <h2>Total Vendido</h2>
        <p>R$ {(totalVendido / 100).toFixed(2)}</p>
      </div>
      <style>
        {`
          .products-page {
            font-family: Arial, sans-serif;
            padding: 100px;
            background-color: rgba(220, 100, 100, 0.95); 
            position: relative; /* Adiciona posição relativa para o botão de voltar */
          }

          .back-button {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #4B5563;
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }

          .back-button:hover {
            background-color: #6B7280;
          }

          h1 {
            color: #000;
            margin-bottom: 20px;
          }

          .error-message {
            color: #d9534f;
            font-weight: bold;
            margin-bottom: 20px;
          }

          .products-list {
            list-style-type: none;
            padding: 0;
          }

          .product-item {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .product-name {
            font-size: 18px;
            margin: 0 0 10px;
          }

          .product-price,
          .product-sold {
            font-size: 16px;
            margin: 5px 0;
          }

          .total-sold {
            margin-top: 20px;
            padding: 15px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .total-sold h2 {
            font-size: 18px;
            margin: 0 0 10px;
          }

          .total-sold p {
            font-size: 16px;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}

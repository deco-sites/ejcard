import { Handlers, PageProps } from "$fresh/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import VendaCardIsland from "../islands/VendaCardIsland.tsx";

export type Card = {
  name: string;
  phone: string;
  card_number: string;
  balance: number;
};

export type Produto = {
  id: number;
  produto: string;
  preço: number;
  vendidos: number;
};

type Data = {
  produtos: Produto[];
  errorMessage?: string;
};

const SUPABASE_URL = "https://bcqocegiolbnjypvtmjp.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcW9jZWdpb2xibmp5cHZ0bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDQxNjksImV4cCI6MjAzNDU4MDE2OX0.pe6jTzbxhpYVEubqqtwPSM8wwSZTBSGpG10tpjcc3mE";
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

export const handler: Handlers<Data> = {
  GET: async (req, ctx) => {
    try {
      const { data: produtosData, error: produtosError } = await client
        .from("produtos")
        .select("id, produto, preço, vendidos");

      if (produtosError) {
        console.error("Erro ao buscar produtos:", produtosError);
        return ctx.render({
          produtos: [],
          errorMessage: "Erro ao buscar produtos",
        });
      }

      if (!Array.isArray(produtosData)) {
        console.error("Dados de produtos inesperados:", produtosData);
        return ctx.render({
          produtos: [],
          errorMessage: "Dados de produtos inesperados",
        });
      }

      const produtos: Produto[] = produtosData.map((produto: any) => ({
        id: produto.id,
        produto: produto.produto,
        preço: produto.preço,
        vendidos: produto.vendidos,
      }));

      return ctx.render({ produtos });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      return ctx.render({
        produtos: [],
        errorMessage: "Erro ao buscar dados",
      });
    }
  },

  POST: async (req, ctx) => {
    try {
      const body = await req.json();
      const { cardNumber, totalAmount, cartItems } = body;

      if (!cardNumber || !totalAmount || !cartItems) {
        return new Response(
          JSON.stringify({ errorMessage: "Dados insuficientes" }),
          { status: 400 },
        );
      }

      // Buscar saldo do cartão
      const { data: cardData, error: cardError } = await client
        .from("cards")
        .select("balance")
        .eq("card_number", cardNumber)
        .single();

      if (cardError) {
        console.error("Erro ao buscar o cartão:", cardError);
        return new Response(
          JSON.stringify({ errorMessage: "Erro ao buscar o cartão" }),
          { status: 500 },
        );
      }

      // Atualizar saldo do cartão, permitindo que fique negativo
      const { error: updateCardError } = await client
        .from("cards")
        .update({ balance: cardData.balance - totalAmount })
        .eq("card_number", cardNumber);

      if (updateCardError) {
        console.error("Erro ao atualizar o saldo do cartão:", updateCardError);
        return new Response(
          JSON.stringify({
            errorMessage: "Erro ao atualizar o saldo do cartão",
          }),
          { status: 500 },
        );
      }

      // Atualizar valores dos produtos vendidos
      for (const item of cartItems) {
        const { id, quantity } = item;

        // Buscar valor atual de vendidos
        const { data: produtoData, error: produtoError } = await client
          .from("produtos")
          .select("vendidos")
          .eq("id", id)
          .single();

        if (produtoError) {
          console.error("Erro ao buscar o produto:", produtoError);
          return new Response(
            JSON.stringify({ errorMessage: "Erro ao buscar o produto" }),
            { status: 500 },
          );
        }

        if (!produtoData) {
          return new Response(
            JSON.stringify({ errorMessage: "Produto não encontrado" }),
            { status: 404 },
          );
        }

        // Atualizar o valor de vendidos
        const novosVendidos = (produtoData.vendidos ?? 0) + quantity;
        const { error: updateProductError } = await client
          .from("produtos")
          .update({ vendidos: novosVendidos })
          .eq("id", id);

        if (updateProductError) {
          console.error("Erro ao atualizar o produto:", updateProductError);
          return new Response(
            JSON.stringify({ errorMessage: "Erro ao atualizar o produto" }),
            { status: 500 },
          );
        }
      }

      return new Response(
        JSON.stringify({ successMessage: "Venda realizada com sucesso" }),
        { status: 200 },
      );
    } catch (error) {
      console.error("Erro interno do servidor:", error);
      return new Response(
        JSON.stringify({ errorMessage: "Erro interno do servidor" }),
        { status: 500 },
      );
    }
  },
};

export default function VendaPage(props: PageProps<Data>) {
  const { produtos, errorMessage } = props.data;

  return (
    <div>
      {errorMessage
        ? <p>{errorMessage}</p>
        : <VendaCardIsland produtos={produtos} />}
    </div>
  );
}

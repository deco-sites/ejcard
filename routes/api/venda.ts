import { Handler } from "$fresh/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://bcqocegiolbnjypvtmjp.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcW9jZWdpb2xibmp5cHZ0bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDQxNjksImV4cCI6MjAzNDU4MDE2OX0.pe6jTzbxhpYVEubqqtwPSM8wwSZTBSGpG10tpjcc3mE";
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

export const handler: Handler = async (req) => {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { cardNumber, totalAmount, cartItems } = body;

      if (!cardNumber || !totalAmount || !cartItems) {
        return new Response(
          JSON.stringify({ errorMessage: "Dados insuficientes" }),
          { status: 400 },
        );
      }

      // Atualiza o saldo do cartão
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

      const updatedBalance = cardData.balance - totalAmount;

      const { error: updateCardError } = await client
        .from("cards")
        .update({ balance: updatedBalance })
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

      // Atualiza os valores dos produtos vendidos
      for (const item of cartItems) {
        const { id, quantity } = item;

        // Busca o produto para obter o valor atual de vendidos
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

        const novosVendidos = produtoData.vendidos + quantity;

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

      // Obtém o saldo atualizado para a resposta
      const { data: finalCardData, error: finalCardError } = await client
        .from("cards")
        .select("balance")
        .eq("card_number", cardNumber)
        .single();

      if (finalCardError) {
        console.error(
          "Erro ao buscar o saldo atualizado do cartão:",
          finalCardError,
        );
        return new Response(
          JSON.stringify({
            errorMessage: "Erro ao buscar o saldo atualizado do cartão",
          }),
          { status: 500 },
        );
      }

      return new Response(
        JSON.stringify({
          successMessage:
            `Venda realizada com sucesso.\nCartão ${cardNumber} com Saldo Atual:\nR$ ${
              (finalCardData.balance / 100).toFixed(2)
            }`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      console.error("Erro interno do servidor:", error);
      return new Response(
        JSON.stringify({ errorMessage: "Erro interno do servidor" }),
        { status: 500 },
      );
    }
  }

  return new Response(null, { status: 405 });
};

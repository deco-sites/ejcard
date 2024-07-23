// src/routes/api/recarga.ts
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
      const { cardNumber, totalAmount } = body;

      if (!cardNumber || typeof totalAmount !== "number") {
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

      if (cardError || !cardData) {
        return new Response(
          JSON.stringify({ errorMessage: "Erro ao buscar o cartão" }),
          { status: 500 },
        );
      }

      // Atualizar saldo do cartão
      const updatedBalance = cardData.balance + totalAmount;

      const { error: updateCardError } = await client
        .from("cards")
        .update({ balance: updatedBalance })
        .eq("card_number", cardNumber);

      if (updateCardError) {
        return new Response(
          JSON.stringify({
            errorMessage: "Erro ao atualizar o saldo do cartão",
          }),
          { status: 500 },
        );
      }

      // Retornar o saldo atualizado
      return new Response(
        JSON.stringify({
          successMessage: `Saldo atualizado com sucesso. Novo saldo: R$ ${
            (updatedBalance / 100).toFixed(2)
          }`,
        }),
        { status: 200 },
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

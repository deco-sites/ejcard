import { h } from "preact";
import { useState } from "preact/hooks";

const RecargaCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/recarga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber,
          totalAmount: parseFloat(amount) * 100,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.successMessage);
      } else {
        setError(data.errorMessage);
      }
    } catch (err) {
      console.error("Erro ao enviar a recarga:", err);
      setError("Erro ao enviar a recarga");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Recarga de Cartão</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="card_number">Número do Cartão</label>
            <input
              type="text"
              id="card_number"
              className="input-field"
              value={cardNumber}
              onInput={(e) =>
                setCardNumber((e.target as HTMLInputElement).value)}
              placeholder="Digite o número do cartão"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Valor da Recarga (R$)</label>
            <input
              type="number"
              id="amount"
              className="input-field"
              value={amount}
              onInput={(e) => setAmount((e.target as HTMLInputElement).value)}
              step="0.01"
              min="0"
              placeholder="Digite o valor da recarga"
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="button-primary">Recarregar</button>
          </div>
          <div className="button-container">
            <a href="/menu" className="button-primary">Voltar</a>
          </div>
        </form>
        {message && <div className="message-box success-message">{message}
        </div>}
        {error && <div className="message-box error-message">{error}</div>}
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
            box-sizing: border-box;
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
          text-decoration: none;
        }

        .button-primary:hover {
          background-color: #6B7280;
        }

        .message-box {
          margin-top: 20px;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }

        .success-message {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #C3E6CB;
        }

        .error-message {
          background-color: #F8D7DA;
          color: #721C24;
          border: 1px solid #F5C6CB;
        }
      `}
      </style>
    </div>
  );
};

export default RecargaCard;

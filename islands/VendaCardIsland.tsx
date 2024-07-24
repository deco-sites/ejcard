import { useState } from "preact/hooks";

export type Produto = {
  id: number;
  produto: string;
  preço: number;
  vendidos: number;
};

export type CartItem = {
  produto: Produto;
  quantity: number;
};

const VendaCardIsland = ({ produtos }: { produtos: Produto[] }) => {
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Novo estado para mensagem de sucesso

  const filteredProducts = produtos.filter((p) => {
    const productName = p.produto || "";
    return productName.toLowerCase().includes(search.toLowerCase());
  });

  const updateTotal = (cart: Record<number, CartItem>) => {
    const newTotal = Object.values(cart).reduce(
      (sum, item) => sum + item.produto.preço * item.quantity,
      0,
    );
    setTotal(newTotal);
  };

  const handleAddToCart = () => {
    if (selectedProductId === null) return;

    const produto = produtos.find((p) => p.id === selectedProductId);
    if (!produto) return;

    setCart((prevCart) => {
      const existingItem = prevCart[produto.id];
      const newQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;

      const updatedCart = {
        ...prevCart,
        [produto.id]: { produto, quantity: newQuantity },
      };

      updateTotal(updatedCart);

      return updatedCart;
    });
  };

  const handleRemoveFromCart = (produtoId: number) => {
    setCart((prevCart) => {
      const { [produtoId]: _removedItem, ...remainingCart } = prevCart;

      updateTotal(remainingCart);

      return remainingCart;
    });
  };

  const handleQuantityChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);
    setQuantity(isNaN(newQuantity) || newQuantity <= 0 ? 1 : newQuantity);
  };

  const handleQuantityInCartChange = (
    produtoId: number,
    newQuantity: number,
  ) => {
    setCart((prevCart) => {
      const item = prevCart[produtoId];
      if (!item) return prevCart;

      const updatedCart = {
        ...prevCart,
        [produtoId]: { ...item, quantity: newQuantity },
      };

      updateTotal(updatedCart);

      return updatedCart;
    });
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement | null;
    if (!form) return;

    const formData = new FormData(form);
    const cardNumber = formData.get("card_number")?.toString() || "";

    if (!cardNumber) return;

    const cartItems = Object.values(cart).map((item) => ({
      id: item.produto.id,
      quantity: item.quantity,
    }));

    const response = await fetch("/api/venda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber,
        totalAmount: total,
        cartItems,
      }),
    });

    const result = await response.json();

    if (result.errorMessage) {
      setSuccessMessage(null); // Limpar mensagem de sucesso
      alert(result.errorMessage);
    } else if (result.successMessage) {
      setSuccessMessage(result.successMessage); // Definir mensagem de sucesso
      setCart({});
      setTotal(0);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Venda</h1>
        <form method="POST" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="card_number">Número do Cartão*</label>
            <input
              type="text"
              name="card_number"
              id="card_number"
              className="input-field"
              placeholder="ex: 169"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="search">Buscar Produto</label>
            <input
              type="text"
              id="search"
              className="input-field"
              value={search}
              onInput={(e) => {
                const target = e.target as HTMLInputElement | null;
                if (target) {
                  setSearch(target.value);
                }
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="product">Selecionar Produto*</label>
            <select
              id="product"
              className="select-field"
              value={selectedProductId || ""}
              onChange={(e) => {
                const target = e.target as HTMLSelectElement | null;
                if (target) {
                  const selectedProductId = parseInt(target.value);
                  setSelectedProductId(selectedProductId);
                }
              }}
            >
              <option value="">Selecione um produto</option>
              {filteredProducts.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.produto} - R$ {(produto.preço / 100).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantidade*</label>
            <input
              type="number"
              id="quantity"
              className="input-field"
              value={quantity}
              onInput={handleQuantityChange}
              min="1"
              required
            />
          </div>
          <div className="button-container">
            <button
              type="button"
              onClick={handleAddToCart}
              className="button-primary"
            >
              Adicionar ao Carrinho
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="total">Total</label>
            <input
              type="text"
              id="total"
              className="input-field"
              value={`R$ ${(total / 100).toFixed(2)}`}
              readOnly
            />
          </div>
          <div className="button-container">
            <button type="submit" className="button-primary">
              Finalizar Compra
            </button>
          </div>
        </form>
        <div>
          <h2>Carrinho</h2>
          {Object.values(cart).map(({ produto, quantity }) => (
            <div key={produto.id} className="cart-item">
              <span>
                {produto.produto} - R$ {(produto.preço / 100).toFixed(2)} x{" "}
                {quantity}
              </span>
              <input
                type="number"
                min="1"
                value={quantity}
                onInput={(e) =>
                  handleQuantityInCartChange(
                    produto.id,
                    parseInt((e.target as HTMLInputElement).value, 10),
                  )}
                className="quantity-input"
              />
              <button
                className="remove-button"
                onClick={() =>
                  handleRemoveFromCart(produto.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="button-container">
          <a href="/menu" className="button-primary">Voltar</a>
        </div>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
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
    box-sizing: border-box;
  }

  .select-field {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #D1D5DB;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .button-container {
    text-align: center;
    margin-top: 16px;
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


  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #E5E7EB;
  }

  .quantity-input {
    width: 60px;
    text-align: center;
  }

  .remove-button {
    background: none;
    border: none;
    color: #EF4444;
    font-size: 16px;
    cursor: pointer;
  }

  .success-message {
    background-color: rgba(255, 0, 0, 0.2); /* Fundo vermelho transparente */
    color: #000000; /* Letras pretas */
    padding: 10px;
    border-radius: 4px;
    margin-top: 16px;
    text-align: center;
        white-space: pre-wrap; 
  }
`}
      </style>
    </div>
  );
};

export default VendaCardIsland;

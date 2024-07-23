import { useEffect, useState } from "preact/hooks";

type Produto = {
  id: number;
  produto: string;
  preço: number;
};

interface RealizarVendaProps {
  produtos: Produto[];
}

const RealizarVenda = ({ produtos }: RealizarVendaProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Produto[]>(produtos);

  useEffect(() => {
    setFilteredProducts(
      produtos.filter((product) =>
        product.produto.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    );
  }, [searchTerm, produtos]);

  const calculateTotal = () => {
    const selectedProducts = document.querySelectorAll(
      ".product-checkbox:checked",
    );
    let total = 0;
    selectedProducts.forEach((product: any) => {
      total += parseFloat(product.dataset.price);
    });
    return total.toFixed(2);
  };

  const handleProductChange = () => {
    const totalElement = document.getElementById("totalAmount");
    if (totalElement) {
      totalElement.innerText = `Total: R$ ${calculateTotal()}`;
    }
  };

  const handleFormSubmit = (event: Event) => {
    const totalAmountInput = document.getElementById(
      "amount",
    ) as HTMLInputElement;
    totalAmountInput.value = calculateTotal();
  };

  return (
    <div className="form-container">
      <h1>Realizar Venda</h1>
      <form method="GET" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="search">Buscar Produto</label>
          <input
            type="text"
            id="search"
            className="input-field"
            placeholder="Buscar por nome do produto"
            value={searchTerm}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </div>
        <div className="form-group">
          <label>Selecione os Produtos</label>
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-item">
              <label>
                <input
                  type="checkbox"
                  className="product-checkbox"
                  data-price={product.preço}
                  onChange={handleProductChange}
                />
                {product.produto} - R$ {product.preço}
              </label>
            </div>
          ))}
        </div>
        <div className="form-group">
          <input
            type="hidden"
            name="amount"
            id="amount"
            className="input-field"
          />
          <div id="totalAmount" className="total-amount">Total: R$ 0.00</div>
        </div>
        <div className="button-container">
          <button
            type="submit"
            className="button-primary"
          >
            Realizar Venda
          </button>
        </div>
      </form>
    </div>
  );
};

export default RealizarVenda;

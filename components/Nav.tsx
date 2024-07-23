interface NavProps {
  loggedIn: boolean;
}

export default function Nav({ loggedIn }: NavProps) {
  const loggedInMenus = [
    { name: "Secret", href: "/auth/secret" },
    { name: "Logout", href: "/logout" },
    { name: "Cadastra", href: "/cadastra" },
    { name: "Consulta", href: "/consulta" },
    { name: "Recarga", href: "/recarga" },
    { name: "Venda", href: "/venda" },
    { name: "Produtos", href: "/produtos" },
    { name: "ListaProdutos", href: "/listaProdutos" },
    { name: "Apurado", href: "/apurado" },
    { name: "index", href: "/index" },
  ];

  const loggedOutMenus = [
    { name: "Login", href: "/login" },
    { name: "Signup", href: "/signup" },
  ];

  return (
    <nav>
    </nav>
  );
}

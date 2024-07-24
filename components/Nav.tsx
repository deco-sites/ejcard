import { h } from "preact";

interface NavProps {
  loggedIn: boolean;
}

export default function Nav({ loggedIn }: NavProps) {
  const menus = [
    { name: "Home", href: "/menu" },
  ];

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
    { name: "Financas", href: "/financas" },
  ];

  const loggedOutMenus = [
    { name: "Login", href: "/login" },
    { name: "Signup", href: "/signup" },
  ];

  // Escolha o menu baseado no estado de login
  const menuItems = loggedIn ? loggedInMenus : loggedOutMenus;

  return (
    <nav>
    </nav>
  );
}

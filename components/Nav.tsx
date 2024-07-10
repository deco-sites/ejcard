

interface NavProps {
    loggedIn: boolean;
}

export default function Nav({ loggedIn }: NavProps) {
    const menus = [
        { name: "Home", href: "/" },
    ];

    const loggedInMenus = [
        { name: "Secret", href: "/auth/secret" },
        { name: "Logout", href: "/logout" },
        { name: "Cadastra", href: "/cadastra"},
        { name: "Consulta", href: "/consulta"}
    ];

    const loggedOutMenus = [
        { name: "Login", href: "/login" },
        { name: "Signup", href: "/signup" },
       
    ];

    return (
        <div class="bg-white max-w-screen-xl flex flex-row items-center justify-between px-4 py-2">
            <div class="text-2xl ml-1 font-bold">Fresh</div>
            <ul class="flex gap-6">
                {menus.map((menu) => (
                    <li key={menu.name}>
                        <a href={menu.href} class="text-blue-500 hover:text-blue-700">
                            {menu.name}
                        </a>
                    </li>
                ))}
                {loggedIn ? loggedInMenus.map((menu) => (
                    <li key={menu.name}>
                        <a href={menu.href} class="text-blue-500 hover:text-blue-700">
                            {menu.name}
                        </a>
                    </li>
                )) : loggedOutMenus.map((menu) => (
                    <li key={menu.name}>
                        <a href={menu.href} class="text-blue-500 hover:text-blue-700">
                            {menu.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

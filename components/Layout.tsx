import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
import Nav from "./Nav.tsx";

interface LayoutProps {
  isLoggedIn: boolean;
  children: ComponentChildren;
}

export default function Layout({ isLoggedIn, children }: LayoutProps) {
  return (
    <div>
      <Head>
        <title>Fresh</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav loggedIn={isLoggedIn} />
      <div class="p-4 mx-auto max-w-screen-md">
        {children}
      </div>
    </div>
  );
}

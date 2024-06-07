import { Link } from "next-view-transitions";
import React from "react";
import { Button } from "./ui/button";

const links = [
  { label: "View Qikink Orders", href: "/view/qikink" },
  { label: "View Printify Orders", href: "/view/printify" },
];

export default function Navbar() {
  return (
    <header className="flex justify-between items-center p-4">
      <Link href="/">
        <h1 className="text-3xl font-bold">sd3-shop</h1>
      </Link>

      <nav>
        <ul className="flex items-center">
          {links.map((link) => (
            <li key={link.href}>
              <Button variant="link" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

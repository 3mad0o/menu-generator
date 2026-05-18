import React from "react";
import { Header } from "./Header";

export const MainLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};

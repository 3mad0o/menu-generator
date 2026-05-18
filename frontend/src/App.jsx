import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { MainLayout } from "@/layout/MainLayout";
import { MyMenus } from "@/pages/menu/MyMenus";
import { SingleMenu } from "./pages/menu/SingleMenu";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/my-menus"
          element={
            <MainLayout>
              <MyMenus />
            </MainLayout>
          }
        />
        <Route
          path="/my-menus/:slug"
          element={
            <MainLayout>
              <SingleMenu />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

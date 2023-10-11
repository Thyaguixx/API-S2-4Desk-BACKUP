import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LendingPage from "../pages/lendingpage";
import ParSaldo from "../pages/parSaldo";
import EstSaldo from "../pages/estSaldo";
import Registration from "../pages/registration";
import { BrowserRouter } from "react-router-dom";
import EstoqueEstabelecimento from "../pages/estEstoque";
import Erro404 from "../pages/erro404";
import EstoqueParceiro from "../pages/parEstoque";

export const Rotas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LendingPage />} />
        <Route path="/estabelecimento-saldo" element={<EstSaldo />} />
        <Route path="/parceiro-saldo" element={<ParSaldo />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/estabelecimento-estoque" element={<EstoqueEstabelecimento />}/>
        <Route path="/parceiro-estoque" element={<EstoqueParceiro />}/>
        <Route path="*" element={<Erro404 />} />

      </Routes>
    </BrowserRouter>
  );
};

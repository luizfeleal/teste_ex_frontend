import './App.css';
import Client from './Components/Clientes/Cliente';
import CreateClient from './Components/Clientes/CriarCliente';
import Order from './Components/Order';
import Product from './Components/Produtos/Produto';
import CriarProduto from './Components/Produtos/CriarProduto';
import {BrowserRouter, Routes, Link, Route} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="#home">Teste EX</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/cliente">Clientes</Nav.Link>
              <Nav.Link as={Link} to="/pedido">Pedidos</Nav.Link>
              <Nav.Link as={Link} to="/produto">Produtos</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
          
          <Routes>
            <Route path="/cliente" index element={<Client/>}></Route>
            <Route path="/criarCliente" element={<CreateClient/>}></Route>
            <Route path="/pedido"  element={<Order/>}></Route>
            <Route path="/produto"  element={<Product/>}></Route>
            <Route path="/criarProduto"  element={<CriarProduto/>}></Route>
          </Routes>
      </BrowserRouter>

      
    </div>
  );
}

export default App;

import React from "react";
import { Table, Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';

class Produto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      showModal: false,
      productIdToDelete: null,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8000/api/produtos")
      .then(response => response.json())
      .then(data => {
        this.setState({ products: data });
      });
  }

  handleDelete(productId) {
    this.setState({
      showModal: true,
      productIdToDelete: productId,
    });
  }

  async confirmDelete() {
    const { productIdToDelete } = this.state;

    try {
      const response = await fetch(`http://localhost:8000/api/produtos/${productIdToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar o produto');
      }

      this.setState((prevState) => ({
        products: prevState.products.filter(product => product.id !== productIdToDelete),
        showModal: false,
        productIdToDelete: null,
      }));
    } catch (error) {
      console.error('Erro ao deletar o produto:', error);
    }
  }

  handleClose() {
    this.setState({
      showModal: false,
      productIdToDelete: null,
    });
  }

  render() {
    const { products, showModal } = this.state;

    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Row className="justify-content-center pb-4">
              <Col md={6}></Col>
              <Col md={6}>
                <Link to="/criarProduto">
                  <Button>+ Adicionar Produto</Button>
                </Link>
              </Col>
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID Produto</th>
                  <th>Descrição</th>
                  <th>Valor de Venda</th>
                  <th>Estoque</th>
                  <th>Editar</th>
                  <th>Excluir</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.descricao}</td>
                    <td>{product.valor_venda}</td>
                    <td>{product.estoque}</td>
                    <td>
                      <Button variant="warning" size="sm">Editar</Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => this.handleDelete(product.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Modal show={showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>Tem certeza que deseja excluir este produto?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={this.confirmDelete}>
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default Produto;
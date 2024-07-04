import React from "react";
import { Container, Row, Col, Button, Form, Modal, Spinner } from "react-bootstrap";

class CriarProduto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      descricao: '',
      valorVenda: '',
      estoque: '',
      imagens: [],
      showModal: false,
      modalMessage: '',
      validated: {
        descricao: false,
        valorVenda: false,
        estoque: false,
        imagens: false,
      },
      isLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name === "valorVenda") {
      this.setState({
        valorVenda: this.formatCurrency(value),
        validated: { ...this.state.validated, valorVenda: !value.trim() }
      });
    } else {
      this.setState({
        [name]: value,
        validated: { ...this.state.validated, [name]: !value.trim() }
      });
    }
  }

  formatCurrency(value) {
    value = value.replace(/\D/g, ''); // Remove non-numeric characters
    const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const formattedValue = new Intl.NumberFormat('pt-BR', options).format(value / 100);
    return `R$ ${formattedValue}`;
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { descricao, valorVenda, estoque, imagens, validated } = this.state;

    const isFormValid = descricao && valorVenda && estoque && imagens.length > 0;
    if (!isFormValid) {
      this.setState({
        validated: {
          descricao: !descricao,
          valorVenda: !valorVenda,
          estoque: !estoque,
          imagens: imagens.length === 0,
        },
        modalMessage: 'Todos os campos são obrigatórios.',
        showModal: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('descricao', descricao);
    formData.append('valorVenda', parseFloat(valorVenda.replace(/[^\d,-]+/g, '').replace(',', '.')));
    formData.append('estoque', estoque);
    imagens.forEach((imagem, index) => {
      formData.append(`imagens[${index}]`, imagem);
    });

    try {
      this.setState({ isLoading: true });

      const response = await fetch(`http://localhost:8000/api/produtos`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar os dados para a API');
      }

      const data = await response.json();
      console.log(data);
      this.setState({
        modalMessage: 'Produto cadastrado com sucesso!',
        showModal: true,
        isLoading: false,
      });

    } catch (error) {
      console.error('Erro:', error);
      this.setState({
        modalMessage: 'Erro ao enviar os dados. Por favor, tente novamente.',
        showModal: true,
        isLoading: false,
      });
    }
  }

  handleFileChange(e) {
    const files = Array.from(e.target.files);
    this.setState({
      imagens: files,
      validated: { ...this.state.validated, imagens: files.length === 0 }
    });
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  render() {
    const { descricao, valorVenda, estoque, imagens, showModal, modalMessage, validated, isLoading } = this.state;

    return (
      <Container>
        <h2 className="my-4">Cadastro de Produto</h2>
        {isLoading && (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        <Form onSubmit={this.handleSubmit} noValidate>
          <Row className="justify-content-center">
            <Col md={4}>
              <Form.Group controlId="formDescricao" style={{ textAlign: 'left' }}>
                <Form.Label>Descrição:</Form.Label>
                <Form.Control
                  type="text"
                  name="descricao"
                  value={descricao}
                  onChange={this.handleChange}
                  placeholder="Descrição"
                  required
                  className={validated.descricao ? 'is-invalid' : ''}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formValorVenda" style={{ textAlign: 'left' }}>
                <Form.Label>Valor de Venda:</Form.Label>
                <Form.Control
                  type="text"
                  name="valorVenda"
                  value={valorVenda}
                  onChange={this.handleChange}
                  placeholder="Valor de Venda"
                  required
                  className={validated.valorVenda ? 'is-invalid' : ''}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={4}>
              <Form.Group controlId="formEstoque" style={{ textAlign: 'left' }}>
                <Form.Label>Estoque:</Form.Label>
                <Form.Control
                  type="number"
                  name="estoque"
                  value={estoque}
                  onChange={this.handleChange}
                  placeholder="Estoque"
                  required
                  className={validated.estoque ? 'is-invalid' : ''}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formImagens" style={{ textAlign: 'left' }}>
                <Form.Label>Imagens:</Form.Label>
                <Form.Control
                  type="file"
                  name="imagens"
                  multiple
                  onChange={this.handleFileChange}
                  required
                  className={validated.imagens ? 'is-invalid' : ''}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Cadastrar
          </Button>
        </Form>

        <Modal show={showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Aviso</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default CriarProduto;
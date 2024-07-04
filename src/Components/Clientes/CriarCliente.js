import React from "react";
import { Container, Row, Col, Button, Form, Modal, Spinner } from "react-bootstrap";

class CriarCliente extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      razaoSocial: '',
      cnpj: '',
      email: '',
      showModal: false,
      modalMessage: '',
      validated: {
        razaoSocial: false,
        cnpj: false,
        email: false,
      },
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.formatCNPJ = this.formatCNPJ.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (name === 'cnpj') {
      this.setState({
        cnpj: this.formatCNPJ(value),
        validated: { ...this.state.validated, [name]: !value.trim() }
      });
    } else {
      this.setState({
        [name]: value,
        validated: { ...this.state.validated, [name]: !value.trim() }
      });
    }
  }

  async handleBlur() {
    if (this.state.cnpj) {
      this.setState({ loading: true });
      try {
        const cnpj = this.state.cnpj.replace(/[^\d]+/g, ''); // Remove caracteres especiais do CNPJ
        const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do CNPJ');
        }
        const data = await response.json();
        this.setState({
          razaoSocial: data.razao_social,
          email: data.estabelecimento.email,
        });
      } catch (error) {
        console.error('Erro ao buscar dados do CNPJ:', error);
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { razaoSocial, cnpj, email, validated } = this.state;

    const isFormValid = razaoSocial && cnpj && email;
    if (!isFormValid) {
      this.setState({
        validated: {
          razaoSocial: !razaoSocial,
          cnpj: !cnpj,
          email: !email,
        },
        modalMessage: 'Todos os campos são obrigatórios.',
        showModal: true,
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ razaoSocial, cnpj, email })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar os dados para a API');
      }

      const data = await response.json();
      console.log(data);
      this.setState({
        modalMessage: 'Cadastro realizado com sucesso!',
        showModal: true,
      });

    } catch (error) {
      console.error('Erro:', error);
      this.setState({
        modalMessage: 'Erro ao enviar os dados. Por favor, tente novamente.',
        showModal: true,
      });
    }
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  formatCNPJ(value) {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18); // Limita ao tamanho do CNPJ formatado
  }

  render() {
    const { razaoSocial, cnpj, email, showModal, modalMessage, validated, loading } = this.state;

    return (
      <Container>
        <h2 className="my-4">Cadastro de Empresa</h2>
        <Form onSubmit={this.handleSubmit} noValidate>
          <Row className="justify-content-center">
            <Col md={4}>
              <Form.Group controlId="formRazaoSocial" style={{ textAlign: 'left' }}>
                <Form.Label>Razão Social:</Form.Label>
                <Form.Control
                  type="text"
                  name="razaoSocial"
                  value={razaoSocial}
                  onChange={this.handleChange}
                  placeholder="Razão Social"
                  required
                  className={validated.razaoSocial ? 'is-invalid' : ''}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formCNPJ" style={{ textAlign: 'left' }}>
                <Form.Label>CNPJ:</Form.Label>
                <Form.Control
                  type="text"
                  name="cnpj"
                  value={cnpj}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  placeholder="CNPJ"
                  required
                  className={validated.cnpj ? 'is-invalid' : ''}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8}>
              <Form.Group controlId="formEmail" style={{ textAlign: 'left' }}>
                <Form.Label>E-mail:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  placeholder="E-mail"
                  required
                  className={validated.email ? 'is-invalid' : ''}
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

        {loading && (
          <div className="loading-overlay">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

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

export default CriarCliente;

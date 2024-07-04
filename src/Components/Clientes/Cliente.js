import React from "react";
import { Table, Container, Row, Col, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

class Client extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clients: []
        }
    }

    componentDidMount() {
        /*fetch("http://localhost:5001/api/alunos")
        .then(response => response.json())
        .then(data => {
            this.setState({clients : data})
        })*/
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-center">
                    <Col md={8}>

                    <Row  className="justify-content-center pb-4">
                        <Col md={6}></Col>
                        <Col md={6}>
                            <Link to="/criarCliente">
                                <Button>+ Adicionar Cliente</Button>
                            </Link>
                        </Col>
                    </Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID Cliente</th>
                                    <th>Razão Social</th>
                                    <th>CNPJ</th>
                                    <th>E-Mail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.clients.map((client) =>
                                        <tr key={client.id}>
                                            <td>{client.id}</td>
                                            <td>{client.razao_social}</td>
                                            <td>{client.cnpj}</td>
                                            <td>{client.email}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Client;

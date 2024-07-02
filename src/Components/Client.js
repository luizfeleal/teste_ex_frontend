import React from "react";
import {Table} from "react-bootstrap";

class Client extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            clients : [
                {
                    'id': 1,
                    "razao_social": "Luiz Felipe Leal",
                    "cnpj": "123.34324.324",
                    "email": "felipelearaujo@gmail.com"
                },
                {
                    'id': 2,
                    "razao_social": "Luiz Felipe Leal",
                    "cnpj": "123.34324.324",
                    "email": "felipelearaujo@gmail.com"
                }
            ]
        }
    }


    render() {
        return (
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
                            <tr>
                                <td>{client.id}</td>
                                <td>{client.razao_social}</td>
                                <td>{client.cnpj}</td>
                                <td>{client.email}</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        )
    }
}

export default Client;
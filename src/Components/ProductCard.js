import React, { useEffect, useState } from "react";
import {Container, Row, Col, Button, Card} from "react-bootstrap";

const Products = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    let componentMounted = true;

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            const response = await fetch("https://fakestoreapi.com/products");
            console.log('cheguei aqui')

            if(componentMounted){
                setData(await response.clone().json());
                setLoading(false);
                //console.log(data)
            }
        }

        getProducts();
    }, [])

    const Loading = () => {
        return(
            <>
                Loading....
            </>
        )
    }

    const ShowProducts = () => {
        return(
            <>
            {data.map((product) => {
                return (
                    <>
                        <Card style={{ width: '18rem' }} key={product.id}>
                            <Card.Img variant="top" src={product.image} alt={product.title}/>
                            <Card.Body>
                                <Card.Title>{product.title}</Card.Title>
                                <Card.Text>
                                {product.price}
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                            </Card.Body>
                        </Card>
                    </>
                )
            })}
            </>
        )
    }


        return (
            <div>
                <Container>
                    <Row>
                    <Col md={12} mb={5}>
                    <h1>Produtos</h1></Col>
                    <hr/>
                    </Row>

                    <Row className="justify-content-center">
                        {loading ? <Loading/> : <ShowProducts/>}
                    </Row>
                </Container>
            </div>
        )
}

export default Products;
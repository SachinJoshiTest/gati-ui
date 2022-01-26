import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Table, Row, Col   } from 'reactstrap';
import ReactDeleteRow from 'react-delete-row';
import Select from 'react-select'
import PurchaseOrderService from "../services/purchase-order.service";

class PurchaseOrder extends Component {

    emptyItem = {
        product: '',
        quantity: '',
        price: '',
        total: ''
    };
    constructor(props) {
        super(props);
        this.state = {
            tablerows:[{product:"Tom",quantity:"Moody",price:23}],
            item: this.emptyItem
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    componentDidMount() {
        PurchaseOrderService.getProducts()
        .then(response => {
          this.setState({selectOptions: response});
          console.log(response);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state)
        let item = {...this.state.item};
        item["total"] = item.quantity * item.price;
        var newdata = this.state.item;
        newdata["total"] = item.quantity * item.price;
        //take the existing state and concat the new data and set the state again
        this.setState({ tablerows: this.state.tablerows.concat(newdata )});
    }

    handleChange(event) {
        const re = /^[0-9\b]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            const target = event.target;
            const value = target.value;
            const name = target.name;
            let item = {...this.state.item};
            item[name] = value;
            this.setState({item});
        }
    }

    handleDropdownChange(e){
       console.log(e)
       let item = {...this.state.item};
       item["product"] = e.productName;
       item["price"] = e.productPrice;
       this.setState({item});
    }

    rows(){
          return this.state.tablerows.map(function(row,i){
                return   (<ReactDeleteRow iconClassName='text-danger' deleteElement='delete' key={i} data={row} onDelete={ row => { return window.confirm(`Are you sure?`) }}>
                         <td>{row.product}</td>
                         <td>{row.quantity}</td>
                         <td>{row.price}</td>
                         <td>{row.total}</td>
                         </ReactDeleteRow>);
          });
    }

    render() {
        const {item} = this.state;
        const title = <h2>'New Purchase Order'</h2>;

        return <div>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Row>
                            <Col><Label for="product">Product</Label></Col>
                            <Col><Select options={this.state.selectOptions} getOptionLabel={(option) => option.productName} getOptionValue={(option) => option.productCode} onChange={this.handleDropdownChange} /></Col>
                            <Col><Label for="quantity">Quantity</Label></Col>
                            <Col><Input type="text" name="quantity" id="quantity" value={this.state.item.quantity}
                                onChange={this.handleChange} autoComplete="email"/></Col>
                            <Col><Button color="primary" type="submit">Add</Button></Col>
                        </Row>
                    </FormGroup>
                </Form>
            </Container>

            <Container>
              <Table striped>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.rows()}
                </tbody>
              </Table>
            </Container>
        </div>
    }
}


export default withRouter(PurchaseOrder);

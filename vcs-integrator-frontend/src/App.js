/*
NOTE TO REVIEWER: This app does not interface with BitBucket as there is currently no 
publicly available BitBucket endpoint to obtain the required user information for this task.
*/

import './App.css';
import User from './components/User';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// This is the main parent component
class App extends React.Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: null,
      isLoading: false,
      userName: '',
      users: [null, null],
    }
  }

  // Update state if user changes input data
  handleInputChange(event) {

    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // Handle form submission
  async handleSubmit(event) {
    // Display loading message
    this.setState({
      isLoading: true,
    });
    // Prevent default HTML form behaviour
    event.preventDefault();

    // Make backend API call
    const userName = this.state.userName.toLowerCase().trim();
    const url = '/api?username=' + userName;
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(
        (result) => {
          this.setState({
            users: result,
            isLoading: false,
          });
          console.log(this.state);
        },
        (error) => { 
          this.setState({
            isLoading: false,
            error,
          }); 
        }
      );
    
  }

  render() {
    console.log(this.state);
    let users = [];
    // To display in result boxes if loading is finished
    if (this.state.isLoading === false) {
      users.push(    
        <Row>
          <Col>
            <User user={this.state.users[0]} vcsProvider='GitHub'/>
          </Col>
          <Col>
            <User user={this.state.users[1]} vcsProvider='GitLab'/>
          </Col>
        </Row>
      );
    }
    // Loading message if loading is in progress
    else {
      users.push(
        <h1>Loading...</h1>
      );
    }

    return (
      <div className="App">
        {/* Search form - controlled componet */}
        <Container className="searchBox pt-3">
          <Form id="searchForm" onSubmit={this.handleSubmit}>
            <Form.Group controlId="formUserName">
              <Form.Label>Enter username</Form.Label>
              <Form.Control 
                type="text" 
                name="userName"
                placeholder="E.g. 'alex'" 
                onChange={this.handleInputChange}/>
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-4">
              Search
            </Button>
          </Form>
        </Container>
        {/* Results from API call go here */}
        <Container>
          {users[0]}
        </Container>
      </div>
    );
  }
}

export default App;

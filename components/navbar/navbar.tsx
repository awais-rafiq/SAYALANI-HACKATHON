import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router';

const navbar = () => {
    const signup = ()=>{
        Router.push('/students')
    }
    const login = ()=>{
        Router.push('/courses')
    }
   
    const publicevents = ()=>{
        Router.push('/attendance')
    }
    const home = ()=>{
      Router.push('/')
  }
  return (
    <>
         <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#"><Image
     
      src="/logo.jpeg"
      alt="Picture of the author"
      width={50}
      height={50}
    /></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
             <Nav.Link href="#action2"><p onClick={home}>Home</p></Nav.Link>
            <Nav.Link href="#action2"></Nav.Link>
            <Nav.Link href="#action2"></Nav.Link>
            <Nav.Link href="#action2"><p onClick={signup}>Students</p></Nav.Link>
            <Nav.Link href="#action2"></Nav.Link>
            <Nav.Link href="#action2"></Nav.Link>
            <Nav.Link href="#action2"><p onClick={login}>Courses</p></Nav.Link>
            <Nav.Link href="#action2"></Nav.Link>
            <Nav.Link href="#action2"></Nav.Link>
            <Nav.Link href="#action2"><p onClick={publicevents}>Attendance</p></Nav.Link>
             
             
          </Nav>
        
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}

export default navbar
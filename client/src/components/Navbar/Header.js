import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Inventory Management System</Navbar.Brand>
        </Container>
      </Navbar>
      <div className="text-center">
        <h3>welcome to Inventory Management system 🎇 </h3>
        <h5>Here you add your Items</h5>
      </div>

    </>
  );
}

export default Header;
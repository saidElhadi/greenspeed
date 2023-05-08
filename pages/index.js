import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useProducts from '../firebase/products';

import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
`;

const NavLogo = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #222222;
`;

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
`;

const NavMenuItem = styled.li`
  margin-left: 16px;
`;

const NavMenuLink = styled.a`
  font-size: 16px;
  font-weight: 500;
  color: #222222;
  text-decoration: none;

  &:hover {
    color: #00aaff;
  }
`;

const SectionContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${props => props.backgroundColor};
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
`;

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  background-color: #222222;
`;

const FooterText = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
`;

const Home = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <>
      <NavContainer>
        <NavLogo>My Website</NavLogo>
        <NavMenu>
          <NavMenuItem>
            <NavMenuLink href="#">Home</NavMenuLink>
          </NavMenuItem>
          <NavMenuItem>
            <NavMenuLink href="#">About</NavMenuLink>
          </NavMenuItem>
          <NavMenuItem>
            <NavMenuLink href="#">Contact</NavMenuLink>
          </NavMenuItem>
        </NavMenu>
      </NavContainer>

      <SectionContainer backgroundColor="#f8f8f8">
        <SectionTitle>Section 1</SectionTitle>
      </SectionContainer>

      <SectionContainer backgroundColor="#00aaff">
        <SectionTitle>Section 2</SectionTitle>
      </SectionContainer>

      <SectionContainer backgroundColor="#222222">
        <SectionTitle>Section 3</SectionTitle>
      </SectionContainer>

      <FooterContainer>
        <FooterText>&copy; 2023 My Website. All rights reserved.</FooterText>
      </FooterContainer>
    </>
  );
};

export default Home;
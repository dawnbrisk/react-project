import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

// Styled components for styling
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  color: #1890ff;
  font-family: 'Arial', sans-serif;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 100px;
  font-weight: bold;
  margin: 0;
  color: #ff4d4f;
`;

const Message = styled.p`
  font-size: 24px;
  color: #555;
  margin: 20px 0;
`;

const HomeButton = styled(Button)`
  margin-top: 20px;
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;
  &:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
`;

const NotFoundPage = () => {
    return (
        <Container>
            <Title>404</Title>
            <Message>Oops! The page you are looking for doesn't exist.</Message>
            <Link to="/">
                <HomeButton size="large">Back to Home</HomeButton>
            </Link>
        </Container>
    );
};

export default NotFoundPage;

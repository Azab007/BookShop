# Book Shop Project

Welcome to the documentation for our Simple Book Shop project. This README file provides an introduction to the project, instructions on how to set it up locally, and an overview of its features.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [Preview](#preview)

## Introduction

Our Simple Shop provide an easy way to buy books by navigating through them easily, adding them to cart and ordering them.

## Features

- **User Authentication**: User registration and login.
- **Books Listings**: Display Books with images, descriptions, and prices.
- **Shopping Cart**: Add and remove Books from the shopping cart.
- **Checkout**: Enter shipping and payment information for orders.
- **Order History**: View past order details.
- **Admin Dashboard**: Manage products

## Technologies Used

- **Frontend**:
  - HTML, CSS, Javascript
  - EJS (Embedded JavaScript) for rendering dynamic content.
  - Axios for making API requests.

- **Backend**:
  - Node.js.
  - Express.js.
  - MongoDB for data storage.
  - Mongoose for data modeling.
  - Stripe: for payment processing

## Getting Started

To set up the project locally, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Azab007/simpleShop.git
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Configure the environment variables as per the instructions in the [Configuration](#configuration) section.

4. Start the development server:

   ```bash
   npm start
   ```

5. Access the application in your web browser at `http://localhost:3000`.

## Configuration

Configure the following environment variables:

- `MONGODB_URI`: MongoDB connection URI.
- `STRIPE_KEY`: Stripe key for accessing stripe

## Usage

1. Register a new account or log in with an existing account.
2. Browse and add products to the shopping cart.
3. Proceed to checkout, enter shipping and payment information, and place orders.
4. View order history and manage your account.
5. If you are an admin, access the admin dashboard to manage products.

### Preview
![Screenshot from 2023-10-06 23-37-22](https://github.com/Azab007/simpleShop/assets/57720086/78cd8f3c-b23b-461a-b48f-b5d2ed142cb1)
![Screenshot from 2023-10-06 23-37-37](https://github.com/Azab007/simpleShop/assets/57720086/f7d2c7d7-27c9-4fe0-a6a1-7f7e3270c2a4)
![Screenshot from 2023-10-06 23-37-46](https://github.com/Azab007/simpleShop/assets/57720086/efeb8b99-c506-4e36-88e2-ebfa88e4b039)
![Screenshot from 2023-10-06 23-37-52](https://github.com/Azab007/simpleShop/assets/57720086/f1c2886d-9697-4879-a25d-aac91fd31a85)
![Screenshot from 2023-10-06 23-38-25](https://github.com/Azab007/simpleShop/assets/57720086/fbbdb66e-884c-468b-ab28-ba6811fd3e93)
![Screenshot from 2023-10-06 23-38-32](https://github.com/Azab007/simpleShop/assets/57720086/837cf9e4-9899-431e-840d-509504da78ad)
![Screenshot from 2023-10-06 23-38-36](https://github.com/Azab007/simpleShop/assets/57720086/c82f0a20-1832-49da-9fd4-67e7b6391e8a)
![Screenshot from 2023-10-06 23-38-41](https://github.com/Azab007/simpleShop/assets/57720086/3653ccc0-1841-45ae-956f-bb089417b2fa)
![Screenshot from 2023-10-06 23-38-51](https://github.com/Azab007/simpleShop/assets/57720086/6c901b36-f044-4b4c-be01-fe653f44313a)


# ToDo Application

This is a simple ToDo application built with Node.js, Express, and MongoDB. It provides a RESTful API for managing users and tasks.

## Project Structure

- `src/` - Contains the source code for the application

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [MongoDB](https://www.mongodb.com/) (v4.x or later)

## Getting Started

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:

    ```bash
    cd src
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `.env` file in the root directory of the project and add the following environment variables:

    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/todo
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

1. Start the MongoDB server if it is not already running:

    ```bash
    mongod
    ```

2. Start the application:

    ```bash
    npm run start
    ```

    The application will be running at `http://localhost:3000`.

### API Endpoints

#### User Endpoints

- **Signup**
  - URL: `/users/signup`
  - Method: `POST`
  - Body:
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```

- **Login**
  - URL: `/users/login`
  - Method: `POST`
  - Body:
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```

- **Logout**
  - URL: `/users/logout`
  - Method: `POST`
  - Headers: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
        "id": 1
    }
    ```

#### Task Endpoints

- **Create Task**
  - URL: `/tasks/create`
  - Method: `POST`
  - Headers: `Authorization: Bearer <token>`

- **Fetch All Tasks**
  - URL: `/tasks/fetch`
  - Method: `GET`
  - Headers: `Authorization: Bearer <token>`

- **Update Task**
  - URL: `/tasks/update`
  - Method: `PATCH`
  - Headers: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
        "id": 1,
        "title": "New Title",
        "description": "Updated Description"
    }
    ```

- **Delete Task**
  - URL: `/tasks/delete`
  - Method: `DELETE`
  - Headers: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
        "id": 1
    }
    ```

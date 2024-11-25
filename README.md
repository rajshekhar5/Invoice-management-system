
# Invoice Management System

This is an **Invoice Management System** built using **React**, **Tailwind CSS** for the frontend, and **Django** for the backend. The project includes various functionalities such as creating and managing invoices, and it is deployed on **Vercel** for the frontend. The backend is tested using **pytest**, and **CORS** is applied for cross-origin requests. Docker files have been set up for containerization, but the backend deployment was not successful.

## Technologies Used

### Frontend
- **React.js**: A JavaScript library for building the user interface.
- **Tailwind CSS**: A utility-first CSS framework for styling the frontend components.
- **Vercel**: Deployed the React application on Vercel for production hosting.

### Backend
- **Django**: A Python web framework used for the backend API to manage invoices and other logic.
- **pytest**: Testing framework used for backend testing.
- **CORS**: Enabled Cross-Origin Resource Sharing for the backend to allow the frontend to make API requests.

### Development Tools
- **Docker**: Used to containerize both the frontend and backend applications for better portability.
- **Docker Compose**: Orchestrates multiple Docker containers for the frontend, backend, and database.

## Features
- **Invoice Management**: Create, view, update, and delete invoices.
- **Frontend**: Built using React with Tailwind CSS for a responsive and modern design.
- **Backend**: Django provides a robust API for managing invoices and interacting with the database.
- **Testing**: 
  - Frontend tested with **Jest**.
  - Backend tested with **pytest**.
- **Dockerized Setup**: Both frontend and backend are containerized using Docker for better portability.
- **CORS Handling**: Enabled CORS to allow secure API calls from the frontend.

## Deployment

### Frontend Deployment
The frontend is deployed on **Vercel** for production use. The deployed app can be accessed at:

[Invoice Management System - Vercel](https://invoice-management-system-fdy8.vercel.app/)

### Backend Deployment
Currently, the backend has been containerized using Docker, but deployment of the backend was not successful. The Dockerized backend is still available for local testing.

## Setup Instructions

### 1. Clone the repository
To get started, clone the repository to your local machine:

```bash
git clone https://github.com/rajshekhar5/Invoice-management-system.git
cd Invoice-management-system
```

### 2. Backend Setup (Django)

#### a. Install Dependencies
Navigate to the backend directory and install the dependencies:

```bash
cd invoice
pip install -r requirements.txt
```

#### b. Apply Migrations
Run the migrations to set up the database:

```bash
python manage.py makemigrations
python manage.py migrate
```

#### c. Run the Development Server
You can start the Django development server locally by running:

```bash
python manage.py runserver
```

Your backend will be running on `http://localhost:8000`.

### 3. Frontend Setup (React)

#### a. Install Dependencies
Navigate to the frontend directory and install the dependencies:

```bash
cd Frontend/invoice-front
npm install
```

#### b. Start the Development Server
You can start the React development server locally by running:

```bash
npm start
```

Your frontend will be running on `http://localhost:3000`.

### 4. Docker Setup

#### a. Backend Docker Setup
To build and run the backend container:

```bash
docker-compose -f docker-compose.yml build backend
docker-compose up backend
```

This will start the backend in a Docker container.

#### b. Frontend Docker Setup
To build and run the frontend container:

```bash
docker-compose -f docker-compose.yml build frontend
docker-compose up frontend
```

This will start the frontend in a Docker container.

### 5. Testing

#### a. Backend Testing with pytest
To run the backend tests using **pytest**, navigate to the backend directory and run:

```bash
pytest
```

#### b. Frontend Testing with Jest
To run the frontend tests using **Jest**, navigate to the frontend directory and run:

```bash
npm test
```


- The backend and Frontend has been Dockerized and successfully deployed to production.
  https://invoice-management-system-fdy8.vercel.app/

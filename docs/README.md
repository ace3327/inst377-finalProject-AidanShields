# inst377-finalProject-AidanShields

# Met Museum Explorer

Currently hosted at https://inst377-final-project-aidan-shields.vercel.app/

## Project Description

Met Museum Explorer is a web-based application that allows users to explore thousands of works from The Metropolitan Museum of Art's public collection. Users can search by keyword, date, department, and medium, and view detailed information about each artwork. The application also tracks user search queries and displays analytical data using charts.

## Target Browsers

This application is designed to be compatible with all major contemporary desktop browsers, including:

* Google Chrome (latest version)
* Mozilla Firefox (latest version)
* Microsoft Edge (latest version)
* Safari (latest version)

IOS Safari and Android Chrome should function as well, but primary support is intended for desktop environments.

## Developer Manual

### Installation

1. Clone the repository

2. Install dependencies

3. Create a `.env` file in the root directory with your Supabase keys

### Running the Application Locally

Use the Vercel CLI to run the application

Alternatively, serve the `index.html` locally using a simple server

Note: API routes (`/api/search.js`, `/api/searches.js`) require Vercel or a serverless environment to execute correctly.

### Running Tests

Currently, there are no automated tests written. Manual functional testing is required for form input, search functionality, and API response validation.

### API Documentation

#### `POST /api/search`

* Saves a search query to the Supabase database
* Request Body:

  {
    "query": "cats",
    "department": "6",
    "dateStart": "1800",
    "dateEnd": "1900",
    "medium": "Oil on canvas"
  }

* Response: `{ status: 'success' }`

#### `GET /api/searches`

* Retrieves all stored search queries from the Supabase database
* Response:

  [
    { "query": "cats", "timestamp": "2025-05-18T10:00:00Z" },
    ...
  ]
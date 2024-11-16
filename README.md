# Portfolio Application with 2FA, Articles, and Data Visualization

A web application designed for users to manage portfolios, browse articles, and visualize population data. This application includes role-based access control, two-factor authentication (2FA), and dynamic data visualization features.

## Features

- **Portfolio Management**: CRUD operations for articles and portfolios.
- **Role-Based Access**: Different levels of access for `admin`, `editor`, and `viewer`.
- **Two-Factor Authentication (2FA)**: Enhanced security with TOTP-based 2FA.
- **Population Data Visualization**: Dynamic graphs for population data, sourced from the World Bank API.
- **Interactive UI**: Filter, search, and manage articles and portfolios efficiently.

---

## Prerequisites

- **Node.js** (v16+)
- **MongoDB** (v4+)
- Environment variables setup (see `.env.example`)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio-app.git
   cd portfolio-app
    ```
   
2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Configure environment variables:
    ```dotenv
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/portfolioDB
    JWT_SECRET=your_jwt_secret
    WORLD_BANK_API=https://api.worldbank.org/v2/country
    ```
   
4. Start the application:
    ```bash
    npm run start
    ```

5. Access the application in your browser:
    ```
    http://localhost:3000
    ```

---

## API Endpoints

### Authentication
- `POST /auth/login`  
  Logs in a user and returns a JWT token.  

  **Request Body:**
  ```json
  {
      "username": "user",
      "password": "password"
  }
    ```

- `POST /auth/2fa/setup`
  Generates a TOTP QR code for 2FA setup.

  **Headers:**
    ```json
    {
        "Authorization": "Bearer <token>"
    }
    ```
  
- `POST /auth/2fa/verify`
  Verifies the 2FA token and enables 2FA for the user.

  **Request Body:**
  ```json
    {
        "token": "123456"
    }
    ```
  
    **Response Example:**
    ```json
    {
        "message": "2FA successfully enabled"
    }
    ```
  
### Portfolio Management
- `GET /portfolio`
  Retrieves a list of all portfolios.


- `POST /portfolio`
  Creates a new portfolio (requires editor or admin role).


- `DELETE /portfolio/<id>`
    Delete a portfolio (requires admin role).


- `PUT /portfolio/<id>`
    Edits a portfolio (requires admin role).

### Population Data
- `GET /population/indicator`
  Fetches population data from the World Bank API.

**Query parameters:**

    - countryCode: Country code (default: WLD).
    - indicatorCode: Indicator code (default: SP.POP.TOTL).
    - indicator (required).
    - startYear (optional).
    - endYear (optional).


## Two-Factor Authentication (2FA) Setup
1. Navigate to the 2FA Enabling page.
2. Scan the QR code using an authenticator app (e.g., Google Authenticator or Authy).
3. Enter the generated code into the input field and submit.
4. Upon successful verification, 2FA will be enabled for your account.


## Design Rationale
1. **Separation of Concerns:**
    - The application uses a modular architecture with separate routes and controllers for auth, portfolio, and population endpoints.
   

2. **Security:**
    - Role-based access control ensures sensitive actions are restricted to authorized users.
    - 2FA provides an additional layer of security for user accounts.


3. **Scalability:**
    - Dynamic API-based data fetching (e.g., from the World Bank API) allows for real-time updates without heavy backend processing.


## Contributing
1. Fork the repository
2. Create a new branch:
    ```
    git checkout -b feat/feature-name
    ```
3. Commit changes and push to your fork:
    ```
    git commit -am 'Add new feature'
    git push origin feature/feature-name
    ```
4. Submit a pull request.


## License
This project is licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License).


## Contact
For questions or support, contact [vladikobdk@gmail.com](mailto:vladikobdk@gmail.com).
```vbnet
Let me know if further customization is needed! 😊
```
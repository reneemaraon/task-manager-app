# Project Title

A brief description of your project, what it does, and its purpose.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/reneemaraon/task-manager-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd task-manager-app
   ```

3. Install the dependencies for both client and api

4. Set up your environment variables

   - Create a `.env` file in the client/ directory and add the necessary environment variables.

   EXPO_PUBLIC_API_URL =IPADDRESS:PORT

   - Setup database info on the api/ `.env` file

## Usage

To start the client application, run

```bash
npx expo start --tunnel
```

Depending on your device, you may install Expo Go for android or scan the QR code on iOS

To start the api application, run:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

You can also run the application in development mode:

```bash
npm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

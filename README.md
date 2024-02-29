# WelSpot

## Running Frontend

* Clone the repository

```bash
git clone https://github.com/TheWelSpot/welspot-hub.git
```

* Install NodeJS LTS version from <https://nodejs.org/en/> for your Operating System.
* Navigate to client folder and install required libraries:

```bash
npm install
```

* In case of any error run audit and install once more:

```bash
npm audit fix --force && npm install
```

* Run the Angular Server:

```bash
npm start
```

## Running Backend Server

* Clone the repository

```bash
git clone https://github.com/TheWelSpot/welspot-hub-api.git
```

* Make sure you have mysql installed and correctly set up.
* Create a new database in MySQL using:

```bash
mysql -u root -p
```

Enter mysql password, then run:

```bash
create database welSpot;
```

* Goto config.go and update your mysql password

```bash
cd database/
code config.js
```

* Now navigate to server folder and run go server:

```bash
node server.js
```

Ignore any errors as it will check for required data tables (show the error), then automatically creates the data tables.

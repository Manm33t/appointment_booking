<p align="center">
<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

---

## Appointment Booking IVR system

This repository contains the code for an **Appointment Booking System** built using **NestJS**, **MongoDB**, and other related technologies. The system is designed to manage appointments for patients, allowing users to create, view, and manage appointments seamlessly.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Patient Management**: Create and update patient records.
- **Appointment Scheduling**: Create, view, and manage appointments for patients.
- **Webhooks Integration**: Handle patient and appointment data via webhooks.
- **Date and Time Formatting**: Date formatting and time manipulation for appointment scheduling.

## Tech Stack

This project uses the following technologies:

- **NestJS**: Framework for building scalable and efficient server-side applications.
- **MongoDB**: NoSQL database for storing patient and appointment data.
- **Mongoose**: ODM (Object Data Modeling) for MongoDB and NestJS.
- **Jest**: Testing framework used for unit and integration tests.
- **TypeScript**: A superset of JavaScript that provides type safety and other features.

## Installation

Follow these steps to set up the project on your local machine:

1. Clone the repository:

````bash

git clone https://github.com/Manm33t/appointment_booking.git

2. Navigate to the project directory:

cd appointment_booking

3. Install the project dependencies:

npm install

4. Set up .env file

5. Running the Application

npm run start

## Usage
Accessing the Application :- http://localhost:3000

## API Endpoints

Here are the available API endpoints for the **Appointment Booking System**.

---

1. Check Patient webhook

- **Method**: `POST`
- **Endpoint**: `/check-patient`
- **Description**: Checks whether a patient is existing or not, and returns few basic detail required by the bot.

Example:

```bash
curl --location 'http://localhost:2000/check-patient' \
--header 'Content-Type: application/json' \
--data '{
  "mobileNumber":"7837027057"
} '
````

2. Create An Appointment webhook

- **Method**: `POST`
- **Endpoint**: `/create-appointment`
- **Description**: Creates patient if not created and after that creates appointment.

Example:

```bash
curl --location 'http://localhost:2000/create-appointment' \
--header 'Content-Type: application/json' \
--data '{
    "session": {
        "firstname": {
            "name": "manmeet",
            "original": "manmeet"
        },
        "lastname": {
            "name": "singh",
            "original": "singh"
        },
        "dob": {
            "year": 1998,
            "month": 5,
            "day": 8
        },
        "appointmenttime": {
            "year": 2024,
            "month": 12,
            "day": 21,
            "hours": 3,
            "minutes": 45,
            "seconds": 44,
            "nanos": 0
        },
        "appointmenttype": "follow-up",
        "insurance": "bajaj insurance",
        "insuranceid": "1233"
    }
}'
```

## Testing

This project includes several unit and integration tests to ensure the core functionality works as expected.

---
 PASS  src/app.service.spec.ts
 PASS  src/helpers/webhook.helper.spec.ts
 PASS  src/app.controller.spec.ts
------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------|---------|----------|---------|---------|-------------------
All files               |   62.12 |    30.55 |    62.5 |   61.01 |                   
 src                    |      50 |    33.33 |   85.71 |   47.22 |                   
  app.controller.ts     |     100 |      100 |     100 |     100 |                   
  app.module.ts         |       0 |      100 |     100 |       0 | 1-29              
  app.service.ts        |     100 |       50 |     100 |     100 | 19-20             
 src/dto                |     100 |      100 |     100 |     100 |                   
  webhook.dto.ts        |     100 |      100 |     100 |     100 |                   
 src/helpers            |   89.74 |    56.25 |   66.66 |   89.18 |                   
  webhook.helper.ts     |   89.74 |    56.25 |   66.66 |   89.18 | 76-84             
 src/schemas            |     100 |      100 |     100 |     100 |                   
  appointment.schema.ts |     100 |      100 |     100 |     100 |                   
  patient.schema.ts     |     100 |      100 |     100 |     100 |                   
 -----------------------|---------|----------|---------|---------|-------------------

Test Suites: 3 passed, 3 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        6.992 s
Ran all test suites.
✨  Done in 8.49s.

## Deployment

https://render.com/

Used above provider to host my backend server, As i dont have access to **Compute Engine** for the server deployment.

Server is hosted on https://appointment-booking-q7vl.onrender.com


## DialogFlow CX 
https://drive.google.com/file/d/1XOJWR3-h79BLhkUKX7d_2lqi2CStsbD8/view?usp=sharing


## DialogFlow CX Test Cases
https://dialogflow.cloud.google.com/cx/projects/steer-dialogflow-demo/locations/global/agents/864bd247-2454-4423-bffc-4c0897209fea/testCases


## Stay in Touch

Author: Manmeet Singh
linkedIn: https://www.linkedin.com/in/manmeet--singh/

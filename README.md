
# Node Login System Starter

This is a login system starter using NodeJS, Express and MongoDB. Docker files are included to run a containerized version of the app and Mongodb for ease of development.


## Run using Docker

#### 1. Clone repo
```bash
git clone https://github.com/awalker7312/node-login-starter.git
```

#### 2. Go to project directory
```bash
cd node-login-starter
```

#### 3. Copy env file
```bash
cp .example.env .env
```

#### 4. Create and run Docker container
```bash
docker-compose up
```

#### 5. Open app in browser
http://localhost:8080


## Screenshots

#### Signup Page
![Signup](screenshots/signup.png "Signup Page")

#### Login Page
![Login](screenshots/login.png "Login Page")

#### Dashboard
![Dashboard](screenshots/dashboard.png "Dashboard")

#### Edit Profile
![Profile](screenshots/profile.png "Edit Profile")


## Tech Stack

**Front end:** HTML, CSS, Bootstrap

**Back end:** NodeJs, Express, Passport


## Authors

- [@awalker7312](https://github.com/awalker7312)


## License

MIT License

Copyright (c) 2023 Alan Walker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

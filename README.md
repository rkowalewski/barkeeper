Barkeeper App
=============
Requirements:
------------
- Node
- Bower

Bower Installation
```
npm install -g bower
```

create database (MySQL):
```
mysql -uroot -h localhost barkeeper < barkeeper.sql
```

install dependencies and run the server
```
git clone git@github.com:rkowalewski/barkeeper.git
npm install
bower install
node server/server.js
```

URL:http://localhost:9000

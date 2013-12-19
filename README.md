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

install dependencies, create the database (optional) and run the server
```
git clone git@github.com:rkowalewski/barkeeper.git
mysql -uroot -h localhost barkeeper < ./data/barkeeper.sql
npm install
bower install
node server/server.js
```

URL:http://localhost:9000

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/guestbook', (req, res) => {
    fs.readFile('messages.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading messages file');
      }
      const messages = JSON.parse(data);
      ejs.renderFile(__dirname + '/guestbook.html', { messages: messages }, (err, html) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error rendering guestbook page');
        }
        res.send(html);
      });
    });
  });
  
  app.get('/newmessage', (req, res) => {
    res.sendFile(__dirname + '/newmessage.html');
  });
  
  app.post('/newmessage', (req, res) => {
    const { username, country, message } = req.body;
    if (!username || !country || !message) {
      return res.status(400).send('All fields are required');
    }
  
    fs.readFile('messages.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading messages file');
      }
      const messages = JSON.parse(data);
      messages.push({ username, country, message });
      fs.writeFile('messages.json', JSON.stringify(messages, null, 2), err => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error writing to messages file');
        }
        res.redirect('/guestbook');
      });
    });
  });
  

app.get('/ajaxmessage', (req, res) => {
  res.sendFile(__dirname + '/ajaxmessage.html');
});

app.post('/ajaxmessage', (req, res) => {
    const { username, country, message } = req.body;
    if (!username || !country || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    fs.readFile('messages.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading messages file' });
      }
      const messages = JSON.parse(data);
      messages.push({ username, country, message });
      fs.writeFile('messages.json', JSON.stringify(messages, null, 2), err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error writing to messages file' });
        }
        res.json(messages);
      });
    });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
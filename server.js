
//portmap.io
//codeware23
//siwom47391@ziragold.com
//siwom47391@
//
//

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 9999

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/submit', (req, res) => {
    const { greetingText } = req.body;

    // Perform server-side validation (you need to implement this if needed)

    // Strip off non-alphanumeric characters
    //const sanitizedText = greetingText.replace(/[^a-zA-Z0-9 ]/g, '');
	const sanitizedText = greetingText.replace(/[,]/g, '...'); //.replace(/[^a-zA-Z0-9 ?!]/g, '');


    // Save data to greetings.csv
    const csvData = `${sanitizedText}\n`;

    fs.appendFile('public/greetings.csv', csvData, (err) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Failed to save greeting.' });
        }

        res.json({ success: true, message: 'Greeting saved successfully.' });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

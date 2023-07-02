const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const e = require('express');

const app = express();
app.use(express.static("public"));
const port = process.env.PORT || 3000;
const urlEncodedParser = bodyParser.urlencoded({ extended:false });

const mailChipKey = "481f4ffa4e2cee679387aad95cc51284-us8";
const listId = "daf260e025"

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/signup/signup.html');
});

app.post('/', urlEncodedParser, (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    console.log("-------------------------------- Subscriber request --------------------------------")
    console.log("firstName: " + firstName + ", lastName: " + lastName+ ", email: " +email);
    console.log("-------------------------------- Subscriber request --------------------------------")

    const url = "https://us8.api.mailchimp.com/3.0/lists/" + listId;
    const options = {
        method: 'POST',
        auth: 'apiKey:' + mailChipKey,
    }

    const members = {
        members: [
            {
                email_address :email,
                email_type: 'text',
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const memberRequest = JSON.stringify(members);

    const request = https.request(url ,options, function (response) {
        response.on("data", function (data) {
            const responseData = JSON.parse(data);
            console.log("-------------------------------- Mail RESPONSE --------------------------------")
            console.log(responseData);
            console.log("-------------------------------- Mail RESPONSE --------------------------------")

            if((response.statusCode <= 200 || response.statusCode > 299) && responseData.error_count === 0){
                res.sendFile(__dirname + '/html/success.html');
            } else {
                res.sendFile(__dirname + '/html/failure.html');
            }
        });
    });

    request.write(memberRequest);
    request.end();

});

app.listen(port, function() {
    console.log('Server listening on port ' + port);
});
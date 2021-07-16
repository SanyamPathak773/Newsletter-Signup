const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { response } = require("express");
const https = require("https");


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", (req,res) =>{
    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const email = req.body.email;

    const Data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(Data);
    const url = 'https://us6.api.mailchimp.com/3.0/lists/fc5b46b5ff';

    const options = {
        method:"POST",
        auth:"sanyam:468aaaa090cf5dc2af9ae3572952503-us6"
    }
    const request = https.request(url, options, (response)=>{
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })

    })
    request.write(jsonData);
    request.on('error', (e) => {
        console.error(e);
      });
    request.end();

});

app.post("/failure", (req, res) =>{
    res.redirect("/");
})

app.listen(3000, ()=> console.log("Server is running"));

// api key
// a468aaaa090cf5dc2af9ae3572952503-us6         

// audience id
// fc5b46b5ff

// '{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}'
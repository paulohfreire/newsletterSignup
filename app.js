const express = require('express')
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  
  //Verificar na Api do mailchimp os campos do members, se precisar alterar
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  //apos o lists/... é o id do usuario no mailchimp
  //na options o auth apos o : é a API key do mailchimp
  const url = "https://us20.api.mailchimp.com/3.0/lists/8933425ebb";
  const options = {
    method: "POST",
    auth: "nativas1:f20698d990e5e3e778044112609ca962-us20"
  }

  const request = https.request(url, options, function(response){
    // Para redirecionar para página de cadastro realizado com sucesso ou página de failure, erro
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

//rota de failure
app.post("/failure", function(req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


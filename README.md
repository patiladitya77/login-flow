# overview

This is simple application demonstrating the login/signup and logout functionality using firebase.<br>  
It also has n8n workflow which gets triggered after every new signup.<br>
Live url:- https://login-flow-bice.vercel.app/

# how to run this locally

run:- git clone https://github.com/patiladitya77/login-flow.git <br>
open the folder in code editor.<br>
run:- npm install<br>
run:- npm run dev<br>

# setting up environment variables

For firebase key:-<br>
login to firebase and create new project and get the API key for auth

For n8n key:-<br>
login to n8n<br>
create a new workflow<br>
create new web-hook<br>
web hook configs:-

    http method: post
    path: signup-welcome

get the production url and use it as VITE_N8N_URL<br>

create new node: email<br>
link the email node with webhook<br>
open the gmail node<br>
connect with your gmail<br>
select resource: message<br>
operation:send<br>
to:{{$json.body.email}}<br>
subject: Welcome, {{$json.body.name}}!<br>
message: Hi {{$json.body.name}},<br><br> Thank you for signing up to our website!<br> We’re happy to have you here.<br><br>
save the workflow<br>

And your workflow is ready!!<br>

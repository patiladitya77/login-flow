# overview

This is simple application demonstrating the login/signup and logout functionality using firebase
It also has n8n workflow which gets triggered after every new signup
Live url:- https://login-flow-bice.vercel.app/

# how to run this locally

run:- git clone https://github.com/patiladitya77/login-flow.git
open the folder in code editor
run:- npm install
run:- npm run dev

# setting up environment variables

For firebase key:-
login to firebase and create new project and get the API key for auth

For n8n key:-
login to n8n
create a new workflow
create new web-hook
web hook configs:-

    http method: post
    path: signup-welcome

get the production url and use it as VITE_N8N_URL

create new node: email
link the email node with webhook
open the gmail node
connect with your gmail
select resource: message
operation:send
to:{{$json.body.email}}
subject: Welcome, {{$json.body.name}}!
message: Hi {{$json.body.name}},<br><br> Thank you for signing up to our website!<br> We’re happy to have you here.<br><br>
save the workflow

And your workflow is ready!!

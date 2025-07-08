cd backend
npm i 
node server
-------
cd frontend 
npm i 
npx serve

![alt text](image.png)

change the server.js: 

// on render
app.use(
  cors({
    origin: [
      "https://adivinha-frontend.onrender.com", 
      "https://guess-who-dor0.onrender.com"
    ],
    methods: ["POST"],
  })
);

// on localhost: 
// app.use(
//   cors({
//     origin: "*", // ← can be used from all places, but just local testing( not safe)
//     methods: ["POST"],
//   })
// );


to access
https://guess-who-dor0.onrender.com

tested on the terminal: 
$ curl -X POST https://adivinha-quem.onrender.com/api/openai/match \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}'
{"bestMatch":{"name":"###","content":"####eas: o ti###o caro"},"score":"0.7485"}

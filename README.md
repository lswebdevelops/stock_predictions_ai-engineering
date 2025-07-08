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


# Photo-based-blogs( Insta like webapp in angular)

This is the project where posts containing photo, title and some content can be posted. It is similar to Instagram but doesn't contain options of comment or like. Feel free to add new features.

## Installing dependencies

To download and install all the required dependencies, git clone or download and extract this repo and inside the project folder(containing file package.json), run command `npm install`

## Running the app

In /backend/app.js file, replace DB_URL with your database connection.         
`mongoose.connect("DB_URL",{useNewUrlParser: true,useUnifiedTopology: true})
        .then(()=>{
            console.log("Connected to mongodb!");
        })
        .catch(err=>{
            console.log("Connection failed")
        })`

Open the project folder in terminal. Then Run the following commands `ng serve` for front-end and in another terminal run command `nodemon server.js` for backend.



import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import axios from "axios";

const app = new express();
const port = 3000;


//Make database connections
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "book",
    password: "postgres",
    port: 5432
});

db.connect();

//body-parser
app.use(bodyParser.urlencoded({extended: true}));

//Access Static Files
app.use(express.static("public"));

let readBook =[
    { title: "Emotional Intelligence", author: "Daniel Goleman", score: 9, summary: "The book tells us that intelligent quotient(IQ) is not the main underlying factor to decide a person success rather it is Emotional Intelligence which plays an important role. The book put emphasis on how successful people use emotional intelligence to achieve their goals. It challenges the notion of giving to much emphasis on IQ in our society." }
];

//Home page route
app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM readbook order by id asc");
    console.log(`result.rows:  ${JSON.stringify(result.rows)}`);
    readBook = result.rows;
    try{
        res.render("index.ejs", {
            bookList: readBook,
        });
        
    } catch(err){
        console.log(err);
    }
});

//Edit route
app.post("/edit", async (req, res) => {
    const summaryValue = req.body.editSummary;
    console.log(`summaryValue = ${req.body.editSummary}`);
    const isbnValue = req.body.summaryISBN;
    console.log(`isbnValue = ${req.body.summaryISBN}`);
    try{
        await db.query(
            "UPDATE readbook SET summary = $1 WHERE ISBN = $2",
            [summaryValue, isbnValue]
        );
        res.redirect("/");
    } catch(err) {
        caonsole.log(err);
    }
});

//contact owner route
app.get("/contact", (req, res) => {
    res.render("contactMe.ejs");
});

app.post("/senderMessage", async (req, res) => {
    const senderName = req.body.senderName;
    const senderEmail = req.body.senderEmail;
    const senderMessage = req.body.senderMessage;
    console.log(`senderName : ${req.body.senderName}`);
    console.log(`senderEmail : ${req.body.senderEmail}`);
    console.log(`senderMessage : ${req.body.senderMessage}`);
    try{
        await db.query(
            "INSERT INTO receivedMessageFromUsers (sender_person_name, sender_person_email, sender_person_message) VALUES ($1, $2, $3)",
            [senderName, senderEmail, senderMessage]
        );
        
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});


//Listen to port
app.listen(port, (req, res)=>{
    console.log(`Server is running on port: ${port}`);
});
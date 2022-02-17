//Module that reads keys from .env file
const dotenv = require('dotenv');

//Node Twitter library
const Twitter = require('twitter');
import { storeTwitterData } from "./addTwitterData";

//Copy variables in file into environment variables
dotenv.config();

//Set up the Twitter client with the credentials
let client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

let currencies: Array<string> = [
    "BTC",
    "ETH",
    "XRP",
    "ADA",
    "BNB",
];

//Downloads and outputs tweet text
async function searchTweets(keyword: string){
    try{
        //Set up parameters for the search
        let searchParams = {
            q: keyword,
            count: 100,
            lang: "en"
        };

        //Wait for search to execute asynchronously
        let result = await client.get('search/tweets', searchParams);

        let promiseArray: Array<Promise<string>> = [];

        //Output the result
        result.statuses.forEach((tweet: any) => {
            //Store save data promise in array
            promiseArray.push(
                storeTwitterData(
                    Number(tweet.id),
                    keyword,
                    tweet.text,
                    Number(new Date(tweet.created_at).getTime() / 1000)
                )
            );
        });

        //Execute all of the save data promises
        let databaseResult: Array<string> = await Promise.all(promiseArray);
        console.log("Database result: " + JSON.stringify(databaseResult));
    }
    catch(error){
        console.log(JSON.stringify(error));
    }
};

//Call function to search for tweets with specified subject
currencies.forEach(function (currency) {
    searchTweets(currency);
});


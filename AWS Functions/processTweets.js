let AWS = require("aws-sdk");

//Create instance of Comprehend
let comprehend = new AWS.Comprehend();

//Function that will be called
exports.handler = (event) => {
    console.log(JSON.stringify(event.Records));

    for (let record of event.Records) {
        if (record.eventName == "INSERT") {
            //Parameters for call to AWS Comprehend
            let id = record.dynamodb.NewImage.ID.N;
            let currency = record.dynamodb.NewImage.Currency.S;
            let text = record.dynamodb.NewImage.Text.S;
            let tweetDate = record.dynamodb.NewImage.TweetDate.N;
            let params = {
                LanguageCode: "en", //Possible values include: "en", "es", "fr", "de", "it", "pt"
                Text: text
            };

            //Call comprehend to detect sentiment of text
            comprehend.detectSentiment(params, (err, data) => {
                //Log result or error
                if (err) {
                    console.log("\nError with call to Comprehend:\n" + JSON.stringify(err));
                }
                else {

                    //Create new DocumentClient
                    var documentClient = new AWS.DynamoDB.DocumentClient();

                    // Table name and data for table
                    let params2 = {
                        TableName: "TweetSentiment",
                        Item: {
                            ID:id.toString(),
                            Currency:currency,
                            Text: text,
                            TweetDate: tweetDate,
                            OverallSentiment: data.Sentiment,
                            Sentiment: data.SentimentScore
                        }
                    };

                    //Store data to database
                    documentClient.put(params2, function(err, data) {
                        if (err) {
                            console.error(JSON.stringify(err));
                        }
                        else {
                            console.log("Sentiment added to table! " + id);
                        }
                    });
                }
            });
        }
    }
};

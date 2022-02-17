let AWS = require("aws-sdk");

//Configure AWS
AWS.config.update({
    region: "us-east-1",
});

//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();

/* Function returns a Promise that will save the text with the specified id. */
export function storeTwitterData(
    id: number,
    keyword: string,
    text: string,
    created_at: number,
): Promise<string> {
    //Table name and data for table

    let params = {
        TableName: "TweetData",
        Item: {
            ID: id,
            Currency: keyword,
            Text: text,
            TweetDate: created_at //Tweet created at
        },
    };

    //Store data in DynamoDB and handle errors
    return new Promise<string>((resolve, reject) => {
        documentClient.put(params, (err) => {
            if (err) {
                reject("Unable to add item: " + JSON.stringify(err));
            } else {
                resolve("Item added to table with id: " + id);
            }
        });
    });
}

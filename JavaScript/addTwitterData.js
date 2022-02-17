"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeTwitterData = void 0;
var AWS = require("aws-sdk");
//Configure AWS
AWS.config.update({
    region: "us-east-1",
});
//Create new DocumentClient
var documentClient = new AWS.DynamoDB.DocumentClient();
/* Function returns a Promise that will save the text with the specified id. */
function storeTwitterData(id, keyword, text, created_at) {
    //Table name and data for table
    var params = {
        TableName: "TweetData",
        Item: {
            ID: id,
            Currency: keyword,
            Text: text,
            TweetDate: created_at //Tweet created at
        },
    };
    //Store data in DynamoDB and handle errors
    return new Promise(function (resolve, reject) {
        documentClient.put(params, function (err) {
            if (err) {
                reject("Unable to add item: " + JSON.stringify(err));
            }
            else {
                resolve("Item added to table with id: " + id);
            }
        });
    });
}
exports.storeTwitterData = storeTwitterData;
//# sourceMappingURL=addTwitterData.js.map
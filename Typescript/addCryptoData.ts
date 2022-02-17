const axios = require("axios");
const AWS = require("aws-sdk");

//Set the region and endpoint
AWS.config.update({
    region: "us-east-1",
});

//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();

/* Contains the main logic of the application */
class Main {
    async getAPIData() {

        try {
            //Execute promise and wait for result.
            let data:
                {data: Array<{  currency: string;
                timestamps: Array<string>;
                prices: Array<number>; }>;
                } = await axios.get(
                "https://api.nomics.com/v1/currencies/sparkline?key=972913eebd8998b5acf243bb016d3e91c7ae468a&ids=BTC,ETH,XRP,ADA,BNB&start=2019-02-08T00%3A00%3A00Z&end=2021-08-01T00%3A00%3A00Z&convert=GBP"
                );

            data.data.forEach((crypto) => {
                crypto.prices.forEach((price, index) => {
                    let timestamp = new Date(crypto.timestamps[index]).getTime() / 1000;
                    //Table name and data for table
                    let params = {
                        TableName: "CryptoData",
                        Item: {
                            Currency: crypto.currency,
                            PriceTimeStamp: timestamp,
                            Price: price,
                        },
                    };

                    //Store data in DynamoDB and handle errors
                    documentClient.put(params,function(err){
                        if (err) {
                            console.error("Unable to add item", params.Item);
                            console.error("Error JSON:", JSON.stringify(err));
                        } else {
                            console.log("Record added to table:", params.Item);
                        }
                    });
                });
            });
        } catch (err) {
            console.error("Error occurred: " + err);
        }
    }
}


let main: Main = new Main();
main.getAPIData();

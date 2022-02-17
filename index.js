

let buttonPressedId = "";//stores the id of clicked button
let coinTocheck = "BTC";//coin to check data for, initally BTC but changes on button click
let sentimentData = [];

//check for button clicks
document.addEventListener('click', function (e) {
    buttonPressedId = e.target.id;
    sentiment();
    numericalGraph();
    if (buttonPressedId == "bnbB") {
        coinTocheck = "BNB";
    } else if (buttonPressedId == "ethB") {
        coinTocheck = "ETH";
    } else if (buttonPressedId == "btcB") {
        coinTocheck = "BTC";
    } else if (buttonPressedId == "xrpB") {
        coinTocheck = "XRP";
    } else if (buttonPressedId == "adaB") {
        coinTocheck = "ADA";
    } else {
        coinTocheck = "BTC"
    }
}, false);


//get sentiment data from DB and plot pie chart
async function sentiment() {
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    try {
        let response = await axios.get("https://w198rkqgkc.execute-api.us-east-1.amazonaws.com/dev/sentiments");
        sentimentData = response.data.Items;
        // for (let x = 0; x < coinArray.length; x++) {
        positiveCount = 0;
        negativeCount = 0;
        neutralCount = 0;

        insertTweetTable();


        document.getElementById("homeTitle").innerHTML = coinTocheck + " Sentiment Analysis And Numerical Data";

        for (let i = 0; i < sentimentData.length; i++) {
            if (sentimentData[i].Currency === coinTocheck) {
                let sentiment = sentimentData[i].OverallSentiment;
                if (sentiment === "POSITIVE") {
                    positiveCount++;
                } else if (sentiment === "NEGATIVE") {
                    negativeCount++;
                } else {
                    neutralCount++;
                }
            }
        }

        var sentimentPie = [{
            values: [positiveCount, negativeCount, neutralCount],
            marker:{
                'colors':[
                    "#42FAB3",
                    "#0e07ec",
                    '#0395f5'
                ]
            },
            title: coinTocheck,
            labels: ['Positive', 'Negative', 'Neutral'],
            type: 'pie',
            textinfo: "label+percent",
        }];

        var layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            height: 450,
            width: 500,
            showlegend: false
        };

        Plotly.newPlot("sentimentDiv", sentimentPie, layout);
        // }


    } catch (ex) {
        console.log(ex)
    }
}

//get numerical data from DB and plot line graph
async function numericalGraph() {
    let numericalData = [];
    let prices = [];
    let dates = [];

    let coinArray = ["BNB", "XRP", "BTC", "ADA", "ETH"];

    try {
        let response = await axios.get("https://w198rkqgkc.execute-api.us-east-1.amazonaws.com/dev/currencies");
        numericalData = response.data.Items;

        // for (let x = 0; x < coinArray.length; x++) {
        prices = [];
        dates = [];
        for (let z = 0; z < numericalData.length; z++) {
            if (numericalData[z].Currency === coinTocheck) {
                prices.push(numericalData[z].Price)
                dates.push(new Date(numericalData[z].PriceTimeStamp * 1000))
            }
        }

        let trace = {
            x: dates,
            y: prices,
            mode: 'line',
            name: coinTocheck,
            marker: {
                color: 'rgb(219, 64, 82)',
                size: 12
            }
        };


        //Set up graph
        let layout = {
            font: {
                color: "white",
                size: 10
            },
            paper_bgcolor: 'rgb(0,0,0,0)',
            plot_bgcolor: 'rgba(97, 211, 234, 0.30)',
            title: coinTocheck,
            xaxis: {
                title: 'Time'
            },
            yaxis: {
                title: 'Price'
            }
        };

        //Data for graph is an array of lines for graph
        let data = [trace];

        //Plot data
        Plotly.newPlot("numericalDiv", data, layout);


    } catch (ex) {
        console.log(ex)
    }
}

//gets tweet text and date for each tweet and then inserts a table for that data
function insertTweetTable() {
    let htmlCode = "<table className='table table-striped table-dark'> <thead><tr><th scope='col'>Tweets</th><th scope='col'>Date</th></tr></thead>" +
        "<tbody>";
    for (let x = 0; x < sentimentData.length; x++) {
        if (sentimentData[x].Currency == coinTocheck) {
            htmlCode += "<tr> <td>" + sentimentData[x].Text + "</td><td>" + new Date(sentimentData[x].TweetDate * 1000).toString().slice(0, 25) + "</td></tr>";

        }
    }
    htmlCode += "</tbody> </table>";
    document.getElementById("tweetTable").innerHTML = htmlCode;
    document.getElementById("tweetTableTitle").innerHTML = coinTocheck + " Tweets";


}

function refreshPage() {
    window.location.reload()
}

window.onload = function () {
    sentiment();
    numericalGraph();
};
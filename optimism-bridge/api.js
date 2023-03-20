const express = require("express");
require("dotenv").config();

const app = express();
const port = 8000;
const {MongoClient} = require("mongodb");

const mongo = new MongoClient(process.env.MONGO_URL);
const database = mongo.db("scaley-valley");
const bridgeProcesses = database.collection("bridgeProcesses");

app.post("/optimism/bridge", express.json({type: '*/*'}), async (req, res) => {
    if (!req.body) {
        res.json({
            message: "Bad request"
        });
        return;
    }
    if (!req.body.tx) {
        res.json({
            message: "Bad request"
        });
        return;
    }
    const txHash = req.body.tx;
    const bridgeProcess = await bridgeProcesses.findOne({
        purchaseTxHash: txHash
    });
    if (bridgeProcess) {
        res.json({
            message: "Bridge already performed"
        });
    } else {
        bridgeProcesses.insertOne({
            purchaseTxHash: txHash,
            allowanceL1TxHash: null,
            bridgeL1TxHash: null,
            status: "NEW",
        }).then(() => {
            res.json({
                message: "Bridge request created"
            });
        }).catch(() => {
            res.json({
                message: "Failed to add bridge request"
            })
        })
    }
});

app.get("/optimism/status", async (req, res) => {
    const purchaseTxHash = req.query.tx;
    const bridgeProcess = await bridgeProcesses.findOne({purchaseTxHash});
    res.json(bridgeProcess);
});

app.listen(port, () => {
    console.log("Start");
})

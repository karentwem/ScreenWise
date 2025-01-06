let client = require('./dbConnection');

let collection = client.db('screenWise').collection('dailyUsage');


// Function to update points balance after screen time usage
async function postDailyUsage(dailyUsage, callback) {
    try {
        // Check if 
        const existingDailyUsage = await collection.findOne({ 
            childNameText: { $eq: dailyUsage.childNameText},
            startDate: { $eq: dailyUsage.startDate}
        }); 
        if(existingDailyUsage) {
            // Update
            const update = { 
                $inc: {
                    //Increment points used
                    pointsUsed: dailyUsage.pointsUsed,
                    //Reduce points available
                    pointsAvailable: -1 * dailyUsage.pointsUsed
                }
            }; 
            const result = await collection.updateOne({ _id: existingDailyUsage._id }, update);
            response = "Points balance updated for " + dailyUsage.childName + '.';  
            return callback(null, response, 201);
        } else {
            // Create new daily usage
            const insertedRow = await collection.insertOne(dailyUsage);
            response = "Points balanced updated for " + dailyUsage.childName + '.';  
            return callback(null, response, 201);
        };
    } catch (err) {
        return callback(err);
    };
};


// Exporting the functions
module.exports = {
    postDailyUsage
};
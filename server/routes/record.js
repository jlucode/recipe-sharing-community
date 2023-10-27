const fs = require("fs");
const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
recordRoutes.use(express.static("public"));
recordRoutes.route("/record").get(async function (req, response) {
  let db_connect = dbo.getDb();

  db_connect
    .collection("records")
    .find({})
    .toArray()
    .then((data) => {
      console.log(data);
      response.json(data);
    });
});

recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  db_connect.collection("records").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

recordRoutes.route("/record/add").post(verifyToken, upload.single("image"), function (req, response) {
  let db_connect = dbo.getDb();

  let myobj = {
    image: req.file ? req.file.filename : undefined,
    name: req.body.name,
    serving: req.body.serving,
    preptime: req.body.preptime,
    calories: req.body.calories,
    level: req.body.level,
    steps: req.body.steps || [],
    authornotes: req.body.authornotes,
    author: req.user.username,
    ratings: [],
  };

  db_connect.collection("records").insertOne(myobj, function (err, res) {
    if (err) throw err;

    db_connect.collection("records").findOne({ _id: res.insertedId }, function (err, addedRecord) {
      if (err) throw err;
      response.json(addedRecord);
    });
  });
});

recordRoutes.route("/update/:id").post(verifyToken,upload.single("image"), async (req, res) => {
  try {
    const recordId = req.params.id;
    const db_connect = dbo.getDb();
    const record = await db_connect.collection("records").findOne({ _id: new ObjectId(recordId) });

    // Check if the logged-in user has the authorization to edit the recipe
    if (req.user.username !== record.author.toString()) {
      return res.status(403).json({ error: "You are not authorized to edit this recipe." });
    }

    // Delete old image file if it exists
    if (req.file && record.image) {
      const oldImagePath = path.join(__dirname, "../public/uploads/", record.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Deleted old image file: ${record.image}`);
        }
      });
    }

    const updatedRecord = {
      name: req.body.name,
      serving: req.body.serving,
      preptime: req.body.preptime,
      calories: req.body.calories,
      level: req.body.level,
      steps: req.body.steps,
      authornotes: req.body.authornotes,
      author: req.body.author,
    };

    if (req.file && req.file.filename) {
      updatedRecord.image = req.file.filename;
    } else if (!record.image) {
      updatedRecord.image = undefined; // Re-add the existing image
    }

    const result = await db_connect.collection("records").updateOne({ _id: new ObjectId(recordId) }, { $set: updatedRecord });

    if (result.modifiedCount === 1) {
      console.log("Record updated successfully");
      res.json({ message: "Record updated successfully" });
    } else {
      console.log("Record not found");
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the record" });
  }
});

recordRoutes.route("/:id").delete(verifyToken, async (req, res) => {
  try {
    const recordId = req.params.id;
    const db_connect = dbo.getDb();
    
   // Find the record by ID
   const record = await db_connect.collection("records").findOne({ _id: new ObjectId(recordId) });

   // Check if the logged-in user has the authorization to delete the recipe
   if (req.user.username !== record.author.toString()) {
    console.log("Authorization Check Failed");
     return res.status(403).json({ error: "You are not authorized to delete this recipe." });
   }

    // Delete image file if it exists
    if (record.image) {
      const imagePath = path.join(__dirname, "../public/uploads/", record.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Deleted image file: ${record.image}`);
        }
      });
    }

    // Delete the record from the database
    const result = await db_connect.collection("records").deleteOne({ _id: new ObjectId(recordId) });

    if (result.deletedCount === 1) {
      console.log("Record deleted successfully");
      res.json({ message: "Record deleted successfully" });
    } else {
      console.log("Record not found");
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the record" });
  }
});

recordRoutes.route("/record/updateRating/:id").post(verifyToken, async function (req, res) {
  const db_connect = dbo.getDb();
  const recordId = new ObjectId(req.params.id);
  const newRating = req.body.rating;

  try {
    // Find the record by ID
    const record = await db_connect.collection("records").findOne({ _id: recordId });

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Check if the user has already voted for this recipe
    const userHasVoted = record.votedUsers && record.votedUsers.includes(req.user.userId);

    if (userHasVoted) {
      return res.status(403).json({ error: "You've already voted for this recipe!" });
    }

    // Update the recipe's ratings and add the user to votedUsers array
    const updatedRecord = {
      $push: {
        ratings: {
          userId: req.user.userId,
          rating: newRating,
          timestamp: Date.now()
        }
      },
      $addToSet: { votedUsers: req.user.userId } // Add the user to votedUsers array
    };

    const result = await db_connect.collection("records").updateOne(
      { _id: recordId },
      updatedRecord
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Rating updated successfully" });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the rating" });
  }
});

module.exports = recordRoutes;
const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require("fs");
const AUDIO_LOCATION = __dirname + "/public/";
const errorHandlingMiddleware = require("../Middleware/errorHandlingMiddleware");
router.use(express.static("public"));
let upload = multer({ dest: AUDIO_LOCATION });
let type = upload.single("upl");

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(process.env.DO_ENDPOINT);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DO_SECRET_ACCESS_KEY
});

router.get("/", (req, res) => {
  res.status(200).send("Welcome to GET /api/upload");
});

router.post(
  "/",
  type,
  errorHandlingMiddleware(async (req, res) => {
    if (req.file === undefined) {
      console.log("nope.");
      return res
        .status(500)
        .send({ message: `You must upload audio with your translation.` });
    }
    await fs.rename(
      `${AUDIO_LOCATION}/${req.file.filename}`,
      `${AUDIO_LOCATION}/${req.file.originalname}`,
      error => {
        if (error) {
          return res.status(500).send({ message: `${error.message}` });
        } else {
          //upload file to DigitalOcean Space
          //if Successfull, delete local file and return 200
          //if fail, delete local file and return 500

          fs.readFile(
            __dirname + `/public/${req.file.originalname}`,
            (err, data) => {
              if (err) throw err;
              const params = {
                Bucket: "howcanisay",
                Key: `${req.file.originalname}`,
                Body: data,
                ACL: "public-read"
              };
              s3.upload(params, function(s3Err, data) {
                if (s3Err) {
                  res.status(500).send({ message: s3Err });
                  throw s3Err;
                }
                console.log(`File uploaded successfully at ${data.Location}`);
                fs.unlink(`${AUDIO_LOCATION}/${req.file.originalname}`, err => {
                  if (err) console.log(err);
                  //log and handle
                  else console.log("successfully deleted"); //log
                });
                res.status(200).send({ message: "success" });
              });
            }
          );
        }
      }
    );
  })
);

module.exports = router;

const express = require("express");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

//INICIALIACION
const app = express();
uuidv4();

//SETTINGS
app.set("port", 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//MIDDLEWARES
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

app.use(multer({storage,
    dest: path.join(__dirname, "public/uploads"),
    limits: { fieldSize: 200000000 },
    fileFilter: (req, file, cb) => {
      var filetypes = /jpg|jpeg|png|gif/;
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(
        "Error: File upload only supports the following filetypes - " +
          filetypes
      );
    }
  }).single("image")
);

//ROUTES
app.use(require("./routes/index.routes"));

//STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});

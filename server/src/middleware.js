import { promisify } from "util";
import path from "path";
import multer, { diskStorage } from "multer";
import fs from "fs/promises";

import db from "./models.js";
const uploadImage = db.images;

const saveUploadedFiles = async files => {
  try {
    const controller = new AbortController();
    const { signal } = controller;

    files.map(file => {
      console.log(file);
      uploadImage.create({
        type: file.mimetype,
        name: file.originalname,
        data: fs.readFile(file, { signal }),
      });
    });

    // Abort the request before the promise settles.
    //controller.abort();

    //await promise;
  } catch (err) {
    // When a request is aborted - err is an AbortError
    console.error(err);
  }
};

let dir = "";
const createTempDir = () =>
  fs.mkdtemp(`${path.resolve("server", "_tmp")}${path.sep}`).then(tmp => {
    dir = tmp;
    console.log(`Created temp dir: ${dir}`);
  });

const cleanUp = () =>
  fs.rm(dir, { recursive: true }).then(
    () => {
      console.log(`Temp dir '${dir}' deleted!}`);
      dir = "";
    },
    err => {
      throw err;
    }
  );

const storage = diskStorage({
  destination: (req, file, callback) => {
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    if (file.mimetype.startsWith("image"))
      callback(null, `${Date.now()}-pet_shop-${file.originalname}`);
    else
      callback(
        `<strong>${file.originalname}</strong> is invalid. Only accepts images.`,
        null
      );
  },
});

const uploadFiles = multer({ storage: storage }).array("multi-files", 10);
const uploadFilesMiddleware = promisify(uploadFiles);

const multipleUpload = async (req, res) => {
  try {
    createTempDir();

    await uploadFilesMiddleware(req, res);
    req.files.map(file => console.log(file.originalname));
    await saveUploadedFiles(req.files);

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }

    setTimeout(() => {
      cleanUp();
    }, 5000);

    return res.send(`Files has been uploaded.`);
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
};

export default multipleUpload;

// fs.rmdir fs.readdir

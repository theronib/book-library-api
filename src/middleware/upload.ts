import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const destination = path.resolve("src", "uploads", "avatars");
        console.log({ destination });
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        console.log({
            file
        });

        const filename = file?.originalname;
        const extension = path.extname(filename);

        if (extension !== ".jpg" && extension !== ".jpeg" && extension !== ".png") {
            return cb(new Error("Only .jpg, .jpeg and .png files are allowed"), filename);
        }

        const newFileName = uuid() + "." + filename;

        cb(null, newFileName);
    }
})

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})
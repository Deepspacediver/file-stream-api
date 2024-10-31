import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary-config.js";

export const uploadNodePOST = asyncHandler(async (req, res) => {
  const file = req.file;
  console.log(req.body);
  if (!file) {
    res.status(400).json({ error: "File is missing" });
    return;
  }
  const b64 = Buffer.from(file.buffer).toString("base64");
  let dataURI = "data:" + file.mimetype + ";base64," + b64;
  const result = await cloudinary.uploader.upload(dataURI, {
    resource_type: "auto",
    flags: "attachment",
  });
  res.json({ url: result.secure_url });
});

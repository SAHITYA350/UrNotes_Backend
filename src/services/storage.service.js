const env = require('dotenv');
env.config();

const ImageKit = require("@imagekit/nodejs").default;


const imagekit = new ImageKit({
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT__URL_ENDPOINT
});

async function uploadFile(buffer) {
    const result = await imagekit.files.upload({
        file: buffer.toString("base64"),
        fileName: "image.jpg"
    });
    return result;
}

module.exports = uploadFile;
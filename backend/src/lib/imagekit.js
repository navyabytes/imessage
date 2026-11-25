
import "dotenv/config";
import ImageKit, { toFile } from "@imagekit/nodejs";

function hasImageKitConfig() {
    return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}

function createFilename(originalName = "upload") {
    const safeName = originalName.replace(/[^a-zA-Z0-9._]/g, "_");
    return `chat-${Date.now()}-${safeName}`;
}

async function uploadChatMedia(file) {
    if (!hasImageKitConfig()) {
        throw new Error("ImageKit private key is missing");
    }

    const imagekit = new ImageKit({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY
    });

    const fileName = createFilename(file.originalname);

    const result = await imagekit.files.upload({
        file: await toFile(file.buffer, fileName, {
            type: file.mimetype
        }),
        fileName,
        folder: "/chat"
    });

    return result.url;
}

export { uploadChatMedia, hasImageKitConfig };

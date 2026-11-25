import ImageKit, {toFile} from "@imagekit/nodejs";

const imagekit = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY});

function hasImageKitConfig() {
    return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}
// originalName: "My photo (1).png"
// result: "chat-1749300000000-My_Photo_1_.png"
// this helper makes a safe, unique filename for uploaded files.
function createFilename(originalName = "upload") {
    const safeName = originalName.replace(/[^a-zA-Z0-9._]/g, "_");
    return `chat-${Date.now()}-${safeName}`;
}

/**
 * Upload image or video to ImageKit
 *  @see https://imagekit.io/docs/api-reference/upload-file/upload-file
 */

async function uploadChatMedia(file) {
    const fileName = createFilename(file.originalname);
    // Implement the actual upload logic using ImageKit
    const result = await imagekit.upload({
        file: await toFile(file.buffer, fileName, {type: file.mimetype}),
        fileName,
        folder: "/chat",
    });
    return result.url;
}

export { uploadChatMedia, hasImageKitConfig };
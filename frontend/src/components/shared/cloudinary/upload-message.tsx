import axios from "axios";

const handleUploadMessage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "s28ysytn");

    let resourceType = "raw";
    if (file.type.startsWith("image/")) resourceType = "image";
    else if (file.type.startsWith("video/")) resourceType = "video";

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/drpxjqd47/${resourceType}/upload`,
            formData
        );

        return {
            url: response.data.secure_url,
            originalName: file.name
        };
    } catch (error) {
        console.log("Upload thất bại: " + error);
        return null;
    }
};

export default handleUploadMessage;

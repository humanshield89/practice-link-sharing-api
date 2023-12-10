import sharp from "sharp";

export const resizeImageCenterCover = async (image, width, height) => {
  const imageBuffer = await sharp(image.data)
    .resize(width, height, {
      fit: "cover",
      position: "center",
    })
    .toFormat("webp")
    .toBuffer();

  return imageBuffer;
};

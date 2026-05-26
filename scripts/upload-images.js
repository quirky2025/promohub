const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'dyz9r0fm7',
  api_key: '536378573955962',
  api_secret: 'IWRd1nbQzeTQSOCa26vkEpKb0OY',
});

const IMAGE_FOLDER = 'C:/Users/jilin/Desktop/trends-images';
const CLOUDINARY_FOLDER = 'promohub/products';

async function uploadImages() {
  const files = fs.readdirSync(IMAGE_FOLDER).filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );

  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(IMAGE_FOLDER, file);
    const publicId = path.parse(file).name;

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        overwrite: false,
        resource_type: 'image',
      });

      results.push({ fileName: file, url: result.secure_url });
    } catch (err) {
    }
  }

  fs.writeFileSync('scripts/upload-results.json', JSON.stringify(results, null, 2));
}

uploadImages();
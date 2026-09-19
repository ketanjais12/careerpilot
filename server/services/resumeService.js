const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const { PDFParse } = require('pdf-parse'); 

/**
 * Converts a memory buffer into a readable stream and uploads to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer from Multer.
 * @returns {Promise<string>} - The secure URL of the uploaded PDF.
 */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'careerpilot_resumes',
        resource_type: 'auto', 
      },
      (error, result) => {
        if (error) {
          reject(new Error('Cloudinary upload failed: ' + error.message));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Extracts raw text from a PDF buffer safely.
 * @param {Buffer} fileBuffer - The file buffer from Multer.
 * @returns {Promise<string>} - The extracted raw text.
 */
const extractTextFromPDF = async (fileBuffer) => {
  let parser = null;
  try {
    parser = new PDFParse({ data: fileBuffer });
    
    const parsedData = await parser.getText();
    
    return parsedData.text; 
    
  } catch (error) {
    throw new Error('Failed to parse PDF text: ' + error.message);
  } finally {
    if (parser && typeof parser.destroy === 'function') {
      await parser.destroy();
    }
  }
};

module.exports = {
  uploadToCloudinary,
  extractTextFromPDF,
};
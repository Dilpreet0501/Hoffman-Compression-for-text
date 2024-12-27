const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');
const connectDB = require('./db');
const File = require('./models/file');
const cloudinary = require("cloudinary").v2; 
require("dotenv").config();

const app = express();
app.use(fileUpload());

// CORS configuration
const corsOptions = {
    origin: 'https://text-compressor.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
connectDB();
const port = process.env.PORT || 3001; 
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

cloudinary.config({ 
    cloud_name: process.env.NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.SECRET_KEY, 
}); 

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log('File path not found');
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.log('Cloudinary error:', error);
        return null;
    }
};

const cppDir = path.join(__dirname, 'cpp');

// Compress Endpoint
app.post('/compress', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            console.error('No files were uploaded.');
            return res.status(400).send('No files were uploaded.');
        }

        const file = req.files.file;
        const newFileName = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(uploadDir, newFileName);

        await file.mv(uploadPath);

        const outputPath = uploadPath.replace('.txt', '_compressed.bin');
        const execPath = path.join(cppDir, 'huffman.exe');
        const compressCommand = `"${execPath}" "${uploadPath}"`;

        exec(compressCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Compression Error: ${stderr}`);
                return res.status(500).send('Compression failed.');
            }

            res.json({ success: true, downloadUrl: `/uploads/${path.basename(outputPath)}` });
        });

    } catch (error) {
        console.error(`Internal Server Error: ${error}`);
        res.status(500).send('Internal server error.');
    }
});

// Decompress Endpoint
app.post('/decompress', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            console.error('No files were uploaded.');
            return res.status(400).send('No files were uploaded.');
        }

        const file = req.files.file;
        const fileName = file.name;
        const output = fileName.replace('.bin', '_decompressed.txt');
        const decompressedFile = await File.findOne({ fileName: output });

        if (!decompressedFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.json({ success: true, downloadUrl: decompressedFile.secureUrl });

    } catch (error) {
        console.error(`Internal Server Error: ${error}`);
        res.status(500).send('Internal server error.');
    }
});

app.get('/uploads/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(uploadDir, fileName);
    res.download(filePath, (err) => {
        if (err) {
            console.error(`Download Error: ${err}`);
            res.status(500).send('Download failed.');
        }
    });
});

app.get('/reload', async (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);

        for (const file of files) {
            const filePath = path.join(uploadDir, file);

            if (file.endsWith('.bin')) {
                
                fs.unlinkSync(filePath);
                // console.log(`Deleted file: ${filePath}`);
            } else {
               
                const response = await uploadOnCloudinary(filePath);

                if (response) {
                    const newFile = new File({
                        fileName: file,
                        secureUrl: response.secure_url,
                    });
                    await newFile.save();
                }
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error(`Reload Error: ${error}`);
        res.status(500).send('Reload failed.');
    }
});

app.use('/uploads', express.static(uploadDir));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



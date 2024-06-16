const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(fileUpload());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const cppDir = path.join(__dirname, '..', 'cpp');

// Compress Endpoint
app.post('/compress', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            console.error('No files were uploaded.');
            return res.status(400).send('No files were uploaded.');
        }

        const file = req.files.file;
        const uploadPath = path.join(uploadDir, file.name);
        await file.mv(uploadPath);

        const outputPath = uploadPath.replace('.txt', '_compressed.txt');
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
        const uploadPath = path.join(uploadDir, file.name);
        await file.mv(uploadPath);

        const outputPath = uploadPath.replace('.txt', '_decompressed.txt');
        

    res.json({ success: true, downloadUrl: `/uploads/${path.basename(outputPath)}` });
  
      
    } catch (error) {
        console.error(`Internal Server Error: ${error}`);
        res.status(500).send('Internal server error.');
    }
});

// Image Compression Endpoint
const pyDir = path.join(__dirname, '..', 'python');
app.post('/img', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const file = req.files.file;
        const uploadPath = path.join(uploadDir, file.name);
        await file.mv(uploadPath);

        const outputPath = uploadPath.replace('.bmp', '_compressed.bmp');
        const execPath = path.join(pyDir, 'image_compressor.py');
        const compressedFilePath = uploadPath.replace('.bmp', '.bin');
        const command = `python "${execPath}" "${uploadPath}" "${compressedFilePath}" "${outputPath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Image Compression Error: ${stderr}`);
                return res.status(500).send('Compression failed.');
            }
            res.json({ success: true, binUrl: `/uploads/${path.basename(compressedFilePath)}`, downloadImgUrl: `/uploads/${path.basename(outputPath)}` });
        });
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
app.use('/uploads', express.static(uploadDir));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

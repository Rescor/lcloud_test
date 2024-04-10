const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
});

const s3 = new AWS.S3();
const localFilesFolder = 'files';

// List files in the bucket
async function listAllFiles(bucket, prefix) {
  const params = {
    Bucket: bucket,
    Prefix: prefix
  };

  const data = await s3.listObjects(params).promise();
  console.log("Files in bucket:", data.Contents.map(object => object.Key));
}

// Upload files to the bucket
async function uploadLocalFiles(bucket, folder) {
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const filePath = path.join(folder, file);
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: bucket,
      Key: `a-wing/${file}`,
      Body: fileContent
    };

    await s3.upload(params).promise();
    console.log(`File ${file} uploaded successfully.`);
  }
}

listAllFiles('developer-task', 'a-wing');
uploadLocalFiles('developer-task', localFilesFolder);
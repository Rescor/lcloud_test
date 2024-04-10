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

// List files by regex
const regex = /^.*$/;

async function listFilesByRegex(bucket, prefix, regex) {
  const params = {
    Bucket: bucket,
    Prefix: prefix
  };

  const data = await s3.listObjects(params).promise();
  const files = data.Contents.filter(object => regex.test(object.Key));
  files.forEach(object => console.log(object.Key));
}

// Delete files by regex
const regexToDelete = /^.*$/;

async function deleteFilesByRegex(bucket, prefix, regex) {
  const params = {
    Bucket: bucket,
    Prefix: prefix
  };

  const data = await s3.listObjects(params).promise();
  const files = data.Contents.filter(object => regex.test(object.Key));

  if (files.length === 0) {
    return console.log("No files found.");
  }

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: files.map(object => ({ Key: object.Key })) }
  };

  await s3.deleteObjects(deleteParams).promise();
  console.log("Files deleted successfully.");
}

//listAllFiles('developer-task', 'a-wing');
//uploadLocalFiles('developer-task', localFilesFolder);
//listFilesByRegex('developer-task', 'a-wing', regex);
deleteFilesByRegex('developer-task', 'a-wing', regexToDelete);
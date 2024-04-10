const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
});

const s3 = new AWS.S3();

// Get files in the bucket
async function listAllFiles(bucket, prefix) {
  const params = {
    Bucket: bucket,
    Prefix: prefix
  };

  const data = await s3.listObjects(params).promise();
  console.log("Files in bucket:", data.Contents.map(object => object.Key));
}

listAllFiles('developer-task', 'a-wing');
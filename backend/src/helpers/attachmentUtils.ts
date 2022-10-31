import * as AWS from 'aws-sdk'
const  AWSXRay= require ('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION as string

//const docClient = new XAWS.DynamoDB.DocumentClient() opps no need
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export function AttachmentUtils(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: parseInt(urlExpiration)
    })
  }
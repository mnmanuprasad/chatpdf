import AWS from "aws-sdk";
import fs from "fs";

export const downloadFromS3 = async(fileKey: string)=>{
    try {
        AWS.config.update({
            credentials:{
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!
            }
        })

        const s3 = new AWS.S3({
            params:{
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            },
            region: process.env.AWS_S3_REGION
        })

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: fileKey,
        }

        const obj =  await s3.getObject(params).promise();
        const filename = `/tmp/pdf-${Date.now()}.pdf`;
        fs.writeFileSync(filename, obj.Body as Buffer);
        return filename;
        
    } catch (error) {
        console.log(error);
        return null;
    }
} 
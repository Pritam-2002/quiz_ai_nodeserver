import { Readable } from 'stream';
import cloudinary from 'cloudinary';
import { error } from 'console';

export const streamUpload = (fileBuffer: Buffer, folder: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (result) resolve(result)
                else reject(error)
            }
        )

        const readable = new Readable();
        readable._read = () => { };
        readable.push(fileBuffer)
        readable.push(null)
        readable.pipe(stream)
    })
}
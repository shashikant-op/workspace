const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
}); 
 
const storage=new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:"workspace",
        allowedtype:['jpg', 'png', 'pdf', 'docx', 'xlsx', 'mp4', 'txt'],
         public_id: (req, file) => Date.now() + '-' + file.originalname
    }

});
module.exports={
    cloudinary,
    storage
}
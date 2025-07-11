import nodemailer from "nodemailer";
const sendMail = async(data) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:"chandrakamalsingh007@gmail.com",
            pass: "Beast@@S3ven"
        }
    });

    try{
        const send = await transporter.sendMail(data)
    }catch(error){
        console.log(error.message);
    }
}

export default sendMail;

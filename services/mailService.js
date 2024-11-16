const nodemailer = require("nodemailer");
const {EMAIL_USER} = require("../config/variables");

const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendSuccessfullyRegisteredMail = async (to, subject) => {
    try {
        await transporter.sendMail({
            from: EMAIL_USER,
            to,
            subject,
            text: "Hello from PortfolioApp. You are registered successfully!",
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email:", error);
    }
}

const sendSuccessfullyCreatedPortfolioMail = async (to, subject) => {
    try {
        await transporter.sendMail({
            from: EMAIL_USER,
            to,
            subject,
            text: "Hello from PortfolioApp. You have successfully created a portfolio!",
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email:", error);
    }
}

const sendSuccessfullyRemovedPortfolioMail = async (to, subject) => {
    try {
        await transporter.sendMail({
            from: EMAIL_USER,
            to,
            subject,
            text: "Hello from PortfolioApp. You have successfully removed a portfolio!",
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email:", error);
    }
}

const sendSuccessfullyUpdatedPortfolioMail = async (to, subject) => {
    try {
        await transporter.sendMail({
            from: EMAIL_USER,
            to,
            subject,
            text: "Hello from PortfolioApp. You have successfully updated a portfolio!",
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email:", error);
    }
}

module.exports = {
    sendSuccessfullyRegisteredMail,
    sendSuccessfullyCreatedPortfolioMail,
    sendSuccessfullyRemovedPortfolioMail,
    sendSuccessfullyUpdatedPortfolioMail,
};
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import GetTouch from "../models/getTouch/getTouchModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendMail } from "../utils/sendMail.js";

export const createGetTouch = CatchAsyncError(async (req, res, next) => {
  const { fullName, email, mobile, message } = req.body;

  if (!fullName || fullName.trim().length < 2) {
    return next(
      new ErrorHandler("Full name is required and must be at least 2 characters", 400)
    );
  }

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Invalid email format", 400));
  }

  if (!mobile) {
    return next(new ErrorHandler("Mobile number is required", 400));
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobile)) {
    return next(
      new ErrorHandler("Invalid mobile number. Must be 10 digits", 400)
    );
  }

  if (!message || message.trim().length < 10) {
    return next(
      new ErrorHandler("Message must be at least 10 characters long", 400)
    );
  }


  const getTouch = await GetTouch.create({
    fullName: fullName.trim(),
    email: email.toLowerCase(),
    mobile,
    message: message.trim(),
  });

  try {
    await sendMail({
      email: process.env.ADMIN_MAIL,
      subject: "📩 New Get In Touch Request",
      template: "getTouchAdmin.ejs",
      data: {
        fullName: getTouch.fullName,
        email: getTouch.email,
        mobile: getTouch.mobile,
        message: getTouch.message,
        createdAt: getTouch.createdAt,
      },
    });
  } catch (mailError) {
    console.error(mailError.message);
  }

  res.status(201).json({
    success: true,
    message: "Your message has been sent successfully we will connect soon",
    data: {
      id: getTouch._id,
    },
  });
});
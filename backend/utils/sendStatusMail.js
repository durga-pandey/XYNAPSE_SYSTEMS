import { sendMail } from "./sendMail.js";

export const sendStatusMail = async (application) => {
  const { status, name, email } = application;

  let subject = "";
  let template = "";
  let data = {};

  switch (status) {
    case "selected":
      subject = "Congratulations! You have been selected";
      template = "selectedMail.ejs";
      data = { name };
      break;

    case "offer_letter_issued":
      subject = "Your Offer Letter is Ready";
      template = "offerLetterMail.ejs";
      data = { application };
      break;

    case "certificate_ready":
      subject = "Your Certificate is Ready";
      template = "certificateMail.ejs";
      data = { application };
      break;

    case "completed":
      subject = "Internship Completed";
      template = "completedMail.ejs";
      data = { name };
      break;

    case "rejected":
      subject = "Application Update";
      template = "rejectedMail.ejs";
      data = { name };
      break;

    default:
      return;
  }

  await sendMail({
    email,
    subject,
    template,
    data,
  });
};

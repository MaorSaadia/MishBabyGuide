// import { defineAction } from "sanity";

// export const sendNewsletterAction = defineAction({
//   name: "sendNewsletter",
//   title: "Send Newsletter",
//   icon: () => "📧",
//   onHandle: async (props) => {
//     const { id } = props;

//     // Get subscriber emails (you'll need to implement subscriber management)
//     const subscriberEmails = ["test@example.com"]; // Replace with actual subscribers

//     const response = await fetch("/api/newsletter/send-manual", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         newsletterId: id,
//         emails: subscriberEmails,
//       }),
//     });

//     if (response.ok) {
//       props.onComplete();
//       alert("Newsletter sent successfully!");
//     } else {
//       alert("Failed to send newsletter");
//     }
//   },
// });

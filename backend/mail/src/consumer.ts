import amqp from "amqplib";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config({});

const resend = new Resend(process.env.RESEND_API_KEY);

export const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string, {
      heartbeat: 60,
    });

    const channel = await connection.createChannel();

    const queueName = "send-otp";

    await channel.assertQueue(queueName, { durable: true });

    console.log("✅ Mail consumer started");

    connection.on("close", () => {
      console.log("❌ RabbitMQ closed. Restarting...");
      setTimeout(startSendOtpConsumer, 5000);
    });

    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const { to, subject, body } = JSON.parse(msg.content.toString());

        const info = await resend.emails.send({
          from: "onboarding@resend.dev",
          to,
          subject,
          html: `<h1>${body}</h1>`,
        });

        console.log("📩 MAIL SENT:", info);

        channel.ack(msg);
      } catch (error: any) {
        console.error("❌ MAIL ERROR:", error.message);

        channel.nack(msg, false, true);
      }
    });

  } catch (error: any) {
    console.error("❌ Consumer failed:", error.message);

    setTimeout(startSendOtpConsumer, 5000);
  }
};
import amqp from "amqplib"

let channel: amqp.Channel | null = null ;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL as string);

        channel = await connection.createChannel();

        await channel.assertQueue("send-otp", { durable: true });

        console.log("✅ Connected to RabbitMQ + Queue Ready");
    } catch (error: any) {
        console.log("❌ Failed RabbitMQ:", error.message);

        setTimeout(connectRabbitMQ, 5000);
    }
};

export const publishToQueue = async (queueName: string, message: any) => {
    try {
        if (!channel) {
            console.log("❌ RabbitMQ NOT READY");
            return;
        }

        console.log("📤 Publishing:", message);

        const sent = channel.sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );

        console.log("📨 SENT:", sent);
    } catch (err) {
        console.log("❌ Publish error:", err);
    }
};
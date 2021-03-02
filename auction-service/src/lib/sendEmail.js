import AWS from 'aws-sdk';

const sqs = new AWS.SQS();
const QUEUE_URL = process.env.MAIL_QUEUE_URL;

const sendEmail = ({subject, recipient, body}) => {
  return sqs.sendMessage({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify({
      subject: subject,
      recipient: recipient,
      body: body,
    })
  }).promise();
}

export default sendEmail;
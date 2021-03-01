import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-1'});

async function sendMail(event, context) {
  const params = {
    Source: 'hicolazu22@hotmail.com',
    Destination: {
      ToAddresses: ['henrico.lazuroz2@gmail.com'],
    },
    Message: {
      Body: {
        Text: {
          Data: 'Hello from Amazon SES'
        },
      },
      Subject: {
        Data: 'Test Mail',
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export const handler = sendMail;
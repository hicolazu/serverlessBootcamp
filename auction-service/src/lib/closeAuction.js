import AWS from 'aws-sdk';
import sendEmail from './sendEmail';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function closeAuction(auction) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED'
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    },
  };

  await dynamodb.update(params).promise();

  const { title, seller, highestBid } = auction;
  const { amount, bidder } = highestBid;

  if (amount === 0) {
    await sendEmail({
      subject: 'No bids on your auction item :(',
      recipient: seller,
      body: `Oh no! Your item "${title}" didn't get any bids. Better luck next time!`,
    });
    return;
  }

  const notifySeller = sendEmail({
    subject: 'Your item has been sold!',
    recipient: seller,
    body: `Woohoo! Your item "${title}" has been sold for $${amount}!`,
  });

  const notifyBidder = sendEmail({
    subject: 'You won an auction!',
    recipient: bidder,
    body: `What a greate deal! You got yourself a "${title}" for $${amount}`,
  });

  return Promise.all([notifySeller, notifyBidder]);
}
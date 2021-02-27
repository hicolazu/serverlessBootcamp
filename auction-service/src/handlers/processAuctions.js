import createError from 'http-errors';
import { getEndedAuctions } from '../lib/getEndedAuctions';
import { closeAuction } from '../lib/closeAuction';
 
async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();
    console.log('Starting CloseAuctions process...');
    const closePromises = auctionsToClose.map(auction => closeAuction(auction));
    await Promise.all(closePromises);
    console.log('Ending CloseAuctions process...');

    return { closed: closePromises.length }
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  
}

export const handler = processAuctions;
import * as functions from 'firebase-functions';
import * as moment from 'moment';

export const getDate = functions.https.onCall((data) => {
    const formattedDate = moment().format();

    return { date: formattedDate };
});

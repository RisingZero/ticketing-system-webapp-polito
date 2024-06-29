import { DateTime } from 'luxon';

export function randomWidth(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function formatDateFromEpoch(seconds) {
    return DateTime.fromSeconds(seconds).toFormat('dd/MM/yyyy HH:mm:ss');
}

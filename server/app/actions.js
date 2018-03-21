import {
    NOTIFICATION_NEW,
} from 'shared/actionTypes';

/**
 * New notification
 * @param  {String} type    Notification type (warning, info, success, error)
 * @param  {Mixed}  message Notification message
 * @return {Object}         Reduct action
 */
export function notification(type, message) {
    return {
        type: NOTIFICATION_NEW,
        payload: {
            type,
            message,
            ignore,
        },
    };
}
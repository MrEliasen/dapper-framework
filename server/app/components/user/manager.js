import jwt from 'jsonwebtoken';

// user specific imports
import {
    USER_AUTHENTICATE,
    USER_AUTHENTICATE_ERROR,
    USER_AUTHENTICATE_SUCCESS,
} from 'shared/actionTypes';

import UserModel from '../../api/models/user';

/**
 * Account manager class
 */
export default class UserManager {
    /**
     * Class constructor
     * @param  {App} App The main app object
     */
    constructor(App) {
        this.App = App;

        // Listen for dispatches from the socket manager
        App.socketManager.on('dispatch', this.handleDispatch.bind(this));
        // log Manager progress
        this.App.logger.info('UserManager::constructor Loaded');
    }

    /**
     * Listen for actions we need to react to, within the manager
     * @param  {Socket.IO Object} socket The client the dispatch was fromt
     * @param  {Object} action Redux action object
     */
    handleDispatch(socket, action) {
        switch (action.type) {
            case USER_AUTHENTICATE:
                return this.authenticate(socket, action);
        }

        return null;
    }

    /**
     * handles authentication requests from clients
     * @param  {Socket.IO Object} socket The socket the request from made from
     * @param  {Object} action Redux action object
     */
    async authenticate(socket, action) {
        if (!action.payload) {
            return;
        }

        jwt.verify(action.payload, this.App.config.api.signingKey, async (err, decoded) => {
            if (err) {
                return this.App.socketManager.dispatchToSocket(socket, {
                    type: USER_AUTHENTICATE_ERROR,
                    payload: 'Invalid authentication token. Please try again.',
                });
            }

            let user;
            let user_id;

            try {
                user = await UserModel.findOneAsync({_id: escape(decoded._id), session_token: escape(decoded.session_token)}, {_id: 1});

                if (!user) {
                    return this.App.socketManager.dispatchToSocket(socket, {
                        type: USER_AUTHENTICATE_ERROR,
                        payload: 'Invalid authentication token. Please try again.',
                    });
                }

                user_id = user._id.toString();
            } catch (err) {
                this.App.onError(err, socket);
            }

            // add the authenticated use to the socket object
            socket.user = {
                user_id,
            };

            // add the socket to the list of active clients
            this.App.socketManager.add(socket);

            return this.App.socketManager.dispatchToSocket(socket, {
                type: USER_AUTHENTICATE_SUCCESS,
                payload: {},
            });
        });
    }
}

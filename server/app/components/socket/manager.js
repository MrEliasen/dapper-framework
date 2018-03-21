import {
    USER_AUTHENTICATE,
    USER_LOGOUT,
} from 'shared/actionTypes';

import io from 'socket.io';
import EventEmitter from 'events';

/**
 * Socket manager
 */
export default class SocketManager extends EventEmitter {
    /**
     * class constructor
     * @param  {App}    App     The App object
     * @param  {Express} server The express/http server object
     */
    constructor(App, server) {
        super(App, server);

        this.App = App;
        // holds the active socket clients, for logged in users
        this.clients = [];
        // webserver
        this.server = server;
        // setup the socket server
        this.io = io(server);

        this.onDisconnect = this.onDisconnect.bind(this);
    }

    /**
     * Get a socket belonging to the user
     * @param  {String} user_id The user id of the user whos socket we are looking for
     * @return {Promise}
     */
    get(user_id) {
        return this.clients.filter((obj) => obj.user && obj.user.user_id == user_id);
    }

    /**
     * Will make the IO server start listening for connections
     */
    listen() {
        // setup event listeners
        this.io.on('connection', this.onConnection.bind(this));

        // listen for connections
        this.server.listen(this.App.config.server.port);

        console.log(`Socket is listing on port ${this.App.config.server.port}`);
    }

    /**
     * Handles new connections
     * @param  {Socket.IO Socket} socket
     */
    onConnection(socket) {
        socket.on('dispatch', (action) => {
            this.onClientDispatch(socket, action);
        });

        socket.on('disconnect', () => {
            this.onDisconnect(socket);
        });
    }

    /**
     * Add a socket to track in the list
     * @param {Socket.Io object} socket The socket object to track
     */
    add(socket) {
        this.clients.push(socket);
    }

    /**
     * Removes a tracked socket reference from the list
     * @param  {String} user_id  User Id of the socket to delete
     */
    remove(socket) {
        const index = this.clients.findIndex((obj) => obj.id === socket.id);

        if (index >= 0) {
            delete this.clients[index];
        }
    }

    /**
     * Handles socket disconnections
     * @param  {Socket.IO Socket} socket        The socket the request from made from
     * @param  {Bool}             forced        Wether this disconnection was forced or not
     */
    async onDisconnect(socket, forced = false) {
        const user = socket.user ? {...socket.user} : null;

        // if the user is logged in, set a timer for when we remove them from the app.
        if (user) {
            socket.leave(user.user_id);
            socket.user = null;

            this.App.logger.info('Socket disconnected', user);
            return this.emit('disconnect', user);
        }

        this.remove(socket.id);
    }

    /**
     * Handles new actions from sockets/the clients
     * @param  {Object} action Redux-action object
     */
    onClientDispatch(socket, action) {
        // make sure the actions has an action type and payload.
        if (!action || !action.type) {
            action.type = null;
        }
        if (!action.payload) {
            action.payload = {};
        }

        this.App.logger.info('New action', {type: action.type});
        // Make sure actions have the right composition
        if (!action.type) {
            return;
        }

        // if the client is not authenticating, but sending dispatches without
        // being authenticated, ignore the request.
        if (!socket.user && action.type !== USER_AUTHENTICATE) {
            return;
        }

        if (action.type === USER_LOGOUT) {
            this.onDisconnect(socket, false, action.type === USER_LOGOUT);
        }

        // emit the dispatch, which managers listen for
        this.emit('dispatch', socket, action);
    }

    /**
     * Dispatches an action to a specific socket
     * @param  {Socket.IO Socket} socket The socket to dispatch to
     * @param  {Object} action Redux action object
     */
    dispatchToSocket(socket, action) {
        socket.emit('dispatch', action);
    }

    /**
     * Dispatches an action to a specific user
     * @param  {String} user_id  User Id of the account
     * @param  {Object} action   Redux action object
     */
    dispatchToUser(user_id, action) {
        this.io.sockets.in(`user_${user_id}`).emit('dispatch', action);
    }

    /**
     * Dispatches an action to a specific room
     * @param  {String} roomId Room ID/key
     * @param  {Object} action Redux action object
     */
    dispatchToRoom(roomId = '', action) {
        this.io.sockets.in(roomId).emit('dispatch', action);
    }

    /**
     * Dispatches an action to the whole server
     * @param  {Object} action Redux action object
     */
    dispatchToServer(action) {
        this.io.emit('dispatch', action);
    }

    /**
     * Get the socket of the user, and join the specific room
     * @param  {String} user_id User ID
     * @param  {String} roomId  Room ID to join
     */
    userJoinRoom(user_id, roomId) {
        const sockets = this.get(user_id);

        sockets.forEach((socket) => {
            socket.join(roomId);
        });
    }

    /**
     * Get the socket of the user, and leaves the specific room
     * @param  {String} user_id User ID
     * @param  {String} roomId  Room ID to leaves
     */
    userLeaveRoom(user_id, roomId) {
        const sockets = this.get(user_id);

        sockets.forEach((socket) => {
            socket.leave(roomId);
        });
    }
}

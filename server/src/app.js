import Promise from 'bluebird';

// component manager
import UserManager from './components/user/manager';
import SocketManager from './components/socket/manager';

/**
 * The App object class
 */
export default class App {
    /**
     * class constructor
     * @param  {Express} server Express/http server object
     * @param  {Object}  config The server config file object
     */
    constructor(server, config, logger, autoInit = true) {
        this.config = config;

        // if we are not in a production environment, add console logging as well
        if (process.env.NODE_ENV === 'development') {
            // enable long stack traces to promises, while in dev
            Promise.longStackTraces();
        }

        // setup the winston logger
        this.logger = logger;

        // Manager placeholders
        this.socketManager = new SocketManager(this, server);
        this.userManager = new UserManager(this);

        this.init();
    }

    /**
     * Init the server managers
     */
    async init() {
        // Listen for connections
        this.socketManager.listen();
    }

    /**
     * Handles error catches, logging the error and (if defined) notifying the user.
     * @param  {Obj}   err  The error object
     * @param  {Mixed} user Socket.io Socket or user_id
     */
    onError(err, user) {
        this.logger.error(err);

        if (!user) {
            return;
        }

        if (typeof user === 'string') {
            this.socketManager.dispatchToUser(user, 'error', 'Something went wrong. Please try again in a moment.');
        } else {
            this.socketManager.dispatchToUser(user, 'error', 'Something went wrong. Please try again in a moment.');
        }
    }

    /**
     * Will run when the server receives a SIGTERM signal/is told to shut down.
     * @param {function} callback Will execute when done.
     */
    shutdown() {
        this.App.logger.info('Received shutdown signal, Running shutdown procedure');
    }
}
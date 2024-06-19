'use strict';

const sqlite = require('sqlite3');

class DBService {
    connected = false;
    db = null;

    constructor() {
        this.connect = this.connect.bind(this);
        this.close = this.close.bind(this);
    }

    get context() {
        if (!this.connected) this.connect();
        return this.db;
    }

    connect() {
        this.db = new sqlite.Database('db.sqlite', (err) => {
            if (err) {
                console.log(`ERROR CONNECTING TO DB: ${err}`);
                process.exit(1);
            } else this.connected = true;
        });
    }

    close() {
        if (this.connected && this.db) this.db.close();
    }
}

module.exports = new DBService();

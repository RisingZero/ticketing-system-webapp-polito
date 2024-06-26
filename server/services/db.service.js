'use strict';

const sqlite = require('sqlite3');

class DbService {
    #connected = false;
    #db = null;
    #inTransaction = false;

    static ERROR_CODES = {
        BUSY: 'SQLITE_BUSY',
    };

    constructor() {}

    get db() {
        return this.#db;
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (this.#connected) {
                resolve();
            } else {
                this.#db = new sqlite.Database('db.sqlite', (err) => {
                    if (err) {
                        console.log(`ERROR CONNECTING TO DB: ${err}`);
                        reject(err);
                    } else {
                        this.#connected = true;
                        resolve();
                    }
                });
                this.#db.configure('busyTimeout', 3000);
            }
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            // Rollback any open transactions
            if (this.#inTransaction) this.#db.run('ROLLBACK');
            // Close the database connection
            if (this.#connected && this.#db) this.#db.close();
            resolve();
        });
    }

    beginTransaction() {
        return new Promise((resolve, reject) => {
            if (!this.#connected) reject(new Error('Database not connected'));
            if (this.#inTransaction) reject(new Error('Transaction already in progress'));
            this.#db.run('BEGIN TRANSACTION');
            this.#inTransaction = true;
            resolve();
        });
    }

    commit() {
        return new Promise((resolve, reject) => {
            if (!this.#connected) reject(new Error('Database not connected'));
            if (!this.#inTransaction) reject(new Error('No transaction in progress'));
            this.#db.run('COMMIT');
            this.#inTransaction = false;
            resolve();
        });
    }

    rollback() {
        return new Promise((resolve, reject) => {
            if (!this.#connected) reject(new Error('Database not connected'));
            if (!this.#inTransaction) reject(new Error('No transaction in progress'));
            this.#db.run('ROLLBACK');
            this.#inTransaction = false;
            resolve();
        });
    }
}

module.exports = DbService;

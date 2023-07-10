class DBError extends Error {
    constructor(error) {
        super(error);
        this.error = error;
        this.name = this.constructor.name;
    }
}

exports.DBError = DBError;

class DataError extends DBError {
    constructor(error) {
        super(error);
    }
}

exports.DataError = DataError;

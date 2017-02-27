'use strict';

module.exports = {
    validateLength(value, min, max) {
        if (!max) {
            max = min;
            min = 3;
        }

        return min <= value.length && value.length <= max;
    }
};
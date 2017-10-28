module.exports = {

    zeroFill: function (number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + ""; // always return a string
    },

    Find: function (term, obj) {
        result = null;
        for (var i in obj) {
            if (obj[i].types.includes(term)) {
                result = obj[i].long_name
                return result;
            }
        }
        return result;
    },

}
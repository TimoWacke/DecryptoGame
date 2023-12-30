
function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            characters.length)));
    }
    return result.join('');
}

function makecode(length = 3) {
    var characters = '1234';
    var length = Math.min(length, characters.length)
    var result = [];
    for (var i = 0; i < length; i++) {
        var index = Math.floor(Math.random() *
            characters.length)
        result.push(characters.charAt(index));
        characters.slice(index, 1)

    }
    return result
}

function generateRandomWords(length = 4) {
    var result = [];
    var words = ["Pferd", "Blau", "Blut", "Eule", "Krone", "Stuhl", "Wissenschaft", "Comic", "Schnurrbart", "Nacht", "Wagen", "Trommel", "Golf", "Keks"];
    for (var i = 0; i < length; i++) {
        result.push(words[Math.floor(Math.random() *
            words.length)]);
    }
    return result;
}

module.exports = { makeid, makecode, generateRandomWords }
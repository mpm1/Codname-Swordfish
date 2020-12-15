const getNamePrefix = function(){
    const prefixList = [
        "black",
        "white",
        "red",
        "blue",
        "blu",
        "green",
        "orange",
        "violet",
        "yellow",
        "rogue",
        "noob",
        "",
        "hacker",
        "nova",
        "digital",
        "cyber",
    ];

    return function() {
        const index = Math.floor(Math.random() * prefixList.length);

        return prefixList[index];
    }
}();

const getNameSuffix = function() {
    const suffixList = [
        "bot",
        "ranger",
        "",
        "wolf",
        "nova",
        "netic",
        "hunter",
    ];

    return function() {
        const index = Math.floor(Math.random() * suffixList.length);

        return suffixList[index];
    }
}
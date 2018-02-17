module.exports = {
    "extends" : [
        "airbnb"
    ],
    "plugins": ["react"],
    "env": {
        "browser": true,
        "es6": true,
    },
    "rules" : {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "no-console": 0,
        "no-unused-vars": 0,
        "no-use-before-define": 0,
        "no-param-reassign": 0              
    }  
};
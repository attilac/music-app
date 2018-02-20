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
        "object-curly-newline": 0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/forbid-prop-types": 0,
        "no-console": 0,
        "no-unused-vars": 0,
        "no-use-before-define": 0,
        "no-param-reassign": 0              
    }  
};
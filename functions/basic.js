/**
 * Created by jovinbm on 1/4/15.
 */
/*Defines basic simple functions*/

module.exports = {

    // this function just prints on the console
    consoleLogger: function (data) {
        console.log(data);
    },


    indexArrayObject: function (myArray, property, value) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === value) return i;
        }
        return -1;
    },


    searchArrayIfExists: function (name, theArray, success) {
        return (theArray.indexOf(name) > -1)
    },


    filterArray: function(theArray, regexExp, success){
        var temp = [];
        theArray.forEach(function (elem) {
            if(regexExp.test(elem)){
                temp.push(elem);
            }
        });

        success(temp)
    }
};
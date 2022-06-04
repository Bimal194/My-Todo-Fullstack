

//console.log(module);
module.exports.getDate= getDate;  //"Hello World!";

function getDate(){

const today= new Date();
// sunday-saturday  --> 0-6
// var day="";
const options = {
weekday: "long",
day: "numeric",
month: 'long'
};

return today.toLocaleDateString("hi-IN", options);


}


module.exports.getDay= getDay ;  //"Hello World!";

function getDay(){

const today= new Date();
// sunday-saturday  --> 0-6
// var day="";
const options = {
weekday: "long",

};

return today.toLocaleDateString("hi-IN", options);

}

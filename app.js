
const express = require("express");
const bodyParser = require("body-parser");
//const date= require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


//console.log(date);

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//  now we don't need below arrays
// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems= [];


mongoose.connect("mongodb+srv://username:<Password>@cluster0.ezyqmhb.mongodb.net/todolistDB");
console.log("server connected!");

const itemsSchema = new mongoose.Schema({
  name: String
});
// const ItemSchema= {
//   name: String
// };

const Item= mongoose.model("Item", itemsSchema);

const item1= new Item({
  name: "Buy food"
});
const item2= new Item({
  name: "Cook food"
});
const item3= new Item({
  name: "Eat food"
});

const defaultItems= [item1, item2, item3];

// Item.deleteMany({name:"Eat food"}, function(err)
// {
//   if(err) {console.log(err);}
//   else{
//     console.log("Successfully saved all items to todoListDB");
//   }
// });
const listSchema= {
  name: String,
  items: [itemsSchema]
}
const List= mongoose.model("List", listSchema);


app.get("/", function(req, res){

 // const day= date.getDate();

 Item.find({}, function(err, results){
//  console.log(results);
  if(results.length===0)
  {
    Item.insertMany([item1, item2, item3], function(err)
    {
      if(err) {console.log(err);}
      else{
        console.log("Successfully saved all items to todoListDB");
      }
    });
    res.redirect("/");
  }
  else{
     res.render("list", {ListTitle: "Today", newListItems: results});
   }
 });
});



app.get("/:customListName" , function(req,res){
  const customListName= _.capitalize(req.params.customListName);


 List.findOne({name: customListName}, function(err, foundList){
   if(!err)
   {
     if(!foundList){
       // if not found then create new list
       //console.log("Doesn't exist");

         const list= new List({
           name : customListName,
           items: defaultItems
         });
         list.save();
         res.redirect("/"+ customListName);
     }
     else {
    //   console.log("Exists!");
    // if already found , just show existing list
       res.render("list", {ListTitle: foundList.name, newListItems: foundList.items});
     }

   }
   else {console.log(err);}
 });

});






app.post("/", function(req,res)
{
  //res.send("File submitted " + req.body.newitem);
  // const item= req.body.newitem;
const itemName= req.body.newitem;//.slice(0,-1);
// https://stackoverflow.com/questions/62000735/typeerror-cannot-read-property-items-of-null-in-monogdb-using-nodejs
const listName= req.body.list;//.slice(0,-1); //for removing an extra space

const item4= new Item({
  name: itemName
});

if(listName=== "Today")
{
  item4.save();
  res.redirect("/");
}
else {

 List.findOne({name: listName}, function(err, foundList){
   if(err){console.log(err);} // changes
   else{
   foundList.items.push(item4);
   foundList.save();
    res.redirect("/" + listName);
  }
 });
}


   // if(req.body.list == "Work")
   // {
   //   workItems.push(item);
   //     res.redirect("/work");
   // }
   // else{
   //     items.push(item);
   //     res.redirect("/");
   // }
    //res.render("list", {newListItem: item});
});


app.post("/delete", function(req,res)
{
//
// console.log(req.body.checkbox);
const itemid= req.body.checkbox;//.slice(0,-1);
const listName= req.body.listName;//.slice(0,-1); //for removing an extra space;

// const itemName= req.body.newitem;
// Item.deleteOne({id: itemid}, function(err){
//   if(err){console.log(err);}
//   else{
//     console.log("Successfully deleted!");
//   }
// });

if(listName === "Today")
{
  Item.findByIdAndRemove(itemid, function(err){
    if(!err){
      console.log("Successfully Removed");
      res.redirect("/");
    }
    else {console.log(err);}  // changes
  });
}
else{
      List.findOneAndUpdate({name: listName}, {$pull: {items:{_id:itemid}}},function(err, foundList){
        if(!err) {res.redirect("/"+listName);}
        else{console.log(err);}
      });
}



});


//
// app.get("/work", function(req,res){
//
//   res.render("list", {ListTitle: "Work List", newListItems: workItems});
// });
//
// app.get("/about", function(req,res){
//   res.render("about");
// });



//
//
// app.post("/work", function(req,res)
// {
//   //res.send("File submitted " + req.body.newitem);
//    let item= req.body.newitem;
//    workItems.push(item);
//
//     //res.render("list", {newListItem: item});
//   res.redirect("/work");
//
// });


app.listen(process.env.PORT || 3000, function(){
  console.log("Server has started Successfully.");
});





// if(today.getDay()===0 || today.getDay()==6)
// {
//   day= "Weekend";
//   //res.sendFile(__dirname + "/index.html");
// }
// else{
//   day= "Weekday";
// //  res.send("<h1> Yy it is the weekend!</h1>");
// }

// if(today.getDay()===0){ day= "Sunday";}
// if(today.getDay()===1){ day= "Monday";}
// if(today.getDay()===2){ day= "Tuesday";}
// if(today.getDay()===3){ day= "Wednesday";}
// if(today.getDay()===4){ day= "Thursday";}
// if(today.getDay()===5){ day= "Friday";}
// if(today.getDay()===6){ day= "Saturday";}

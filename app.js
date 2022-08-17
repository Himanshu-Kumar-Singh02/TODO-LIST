const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const date = require(__dirname+"/date.js")

const _ = require("lodash")

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://HIMANSHUKUMARSINGH:Todolist123@cluster0.zjxdg.mongodb.net/ItemsDB",{useNewUrlParser:true,useUnifiedTopology: true});

// var items = ["Breakfast","Brunch","Lunch"];
//
// var workitems = [];

app.set("view engine","ejs");

app.use(express.static("public"));

const itemsSchema={
  name:String
}

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"Welcome to ToDoList!"
});
const item2 = new Item({
  name:"Hit the + button to add new item "
});
const item3 = new Item({
  name:"<-- click here to remove items"
});

const itemArray = [item1,item2,item3]

const listSchema={
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){

  Item.find(function(err,founditems){

if(founditems.length===0){
  Item.insertMany(itemArray,function(err){
    if(err){
      vonsole.log(err)
    }else{
      console.log("successfully saved to db");
    }
  });
  res.redirect("/");
}
    var day = date();
      res.render("list",{kindofDay:day,listHeading:"ToDoList",litem:founditems});
  });
});

app.post("/",function(req,res){
    var itemName = req.body.newItem;
    var listName = req.body.listname;

    const item4 = new Item({
      name:itemName
    });

if(listName==="ToDoList"){
  item4.save();
  res.redirect("/");
}
else{
  List.findOne({name:listName},function(err,foundlist){
    foundlist.items.push(item4);
    foundlist.save();
    res.redirect("/"+listName);
  })
}

//   if(req.body.listname==="WORK"){
//     workitems.push(item);
//     res.redirect("/work");
//   }
// else{
//   items.push(item);
//   res.redirect("/");
// }
});

app.post("/delete",function(req,res){

const checkedItemId = req.body.checkboxx;
const hiddenlistname = req.body.hiddenlistname;

if(hiddenlistname==="ToDoList"){
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("succesfully deleted");
      res.redirect("/");
    }
  })
}else{
  List.findOneAndUpdate({name:hiddenlistname},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
    if(!err){
      res.redirect("/"+hiddenlistname);
    }
  })
}

})


app.get("/:customListName",function(req,res){
  const customListName =_.capitalize(req.params.customListName);
  List.findOne({name:customListName},function(err,foundlist){
    if(!err){
      if(!foundlist){
        const list = new List({
          name:customListName,
          items:itemArray
        });
        list.save();
        res.redirect("/")
      }else{
        var day = date();
          res.render("list",{kindofDay:day,listHeading:foundlist.name,litem:foundlist.items});
        console.log("found list")

      }
    }
  });
})

// app.get("/work",function(req,res){
// var day = date();
//   res.render("list",{kindofDay:day,listHeading:"WORK",litem:workitems});
// })

app.listen(process.env.PORT||3000,function(){
  console.log("Server is running on 3000 port");
});

// Todolist123

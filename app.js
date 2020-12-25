//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const {
  Item,
  List,
  defaultItems
} = require("./data.js");

const app = express();
const PORT = 3000;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://mtruong:everwood@cluster0.danc0.mongodb.net/todolistDB?retryWrites=true&w=majority/", {
  useNewUrlParser: true
});

app.get("/", function(req, res) {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err, newItems) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Successfully saved default items to database!");
          console.log(newItems);
        }
      })
    }
    if (err) {
      console.error(err);
    } else {
      console.log(foundItems)
      const items = foundItems;
      res.render("list", {
        listTitle: "Today",
        newListItems: items
      });
    }
  })
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName)
  List.findOne({
    name: customListName
  }, (err, foundList) => {
    if (err) {
      console.error(err)
    } else {
      if (!foundList) {
        console.log("Doesn't exist!")
        const list = new List({
          name: customListName,
          items: defaultItems
        })
        list.save();
        res.redirect(`/${customListName}`);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  })
})

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  if (listName === "Today") {
    Item.create({
      name: itemName
    }, (err, createdItem) => {
      if (err) {
        console.error(err)
      } else {
        console.log(createdItem);
        res.redirect("/");
      }
    });
  } else {
    List.findOne({
      name: listName
    }, (err, foundCustomListName) => {
      if (!err) {
        foundCustomListName.items.push({
          name: itemName
        })
        foundCustomListName.save();
        res.redirect(`/${listName}`);
      } else {
        console.error(err)
      }
    })
  }
});

app.post("/delete", (req, res) => {
  const checkedItemID = req.body.checkbox
  const listName = req.body.listName

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemID, (err, deletedItem) => {
      if (!err) {
        res.redirect("/");
      } else {
        console.error(err)
      }
    })
  } else {
    List.findOneAndUpdate({
        name: listName
      }, {
        $pull: {
          items: {
            _id: checkedItemID
          }
        }
      },
      (err, foundList) => {
        if (err) {
          console.error(err)
        } else {
          res.redirect(`/${listName}`)
        }
      })
  }
})


app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(PORT, function() {
  console.log("Server started on port 3000");
});

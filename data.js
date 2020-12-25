const mongoose = require('mongoose');

// Schema
const itemsSchema = {name: String}

// Model
const Item = mongoose.model("Item", itemsSchema)


const item1 = new Item({
  name: "Welcome to your todolist!"
})

const item2 = new Item({
  name: "Hit the + button to add a new item."
})

const item3 = new Item({
  name: "<-- Hit this button to delete an item."
})

const defaultItems = [item1, item2, item3]

const listSchema = {
  name: String,

  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

module.exports = {
    Item: Item,
    List: List,
    defaultItems: defaultItems
};

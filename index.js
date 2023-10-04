import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const inputEl = document.getElementById('input-field')
const CartBtn = document.getElementById('cart-btn')
const shoppingListEl = document.getElementById('UL')

// Storing data into the firebase database
const appSettings = {
    databaseURL: "https://play-d518e-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)  //Creating an app 
const database = getDatabase(app)  // connecting app to the database
const shoppingListInDB = ref(database, "shoppingList") // creating a reference in the database to store data

CartBtn.addEventListener('click', function(){
    let inputValue = inputEl.value
    push(shoppingListInDB, inputValue) // pushing the data into the database
    
    clearInputFieldEl()
   
    
})
// To fetch the data from the real time database of the firebase
onValue(shoppingListInDB, function(snapshot){

    // checking if snapshot exist or not to make decision
    if(snapshot.exists()){
        let arrayItems = Object.entries(snapshot.val()) // changing obeject into the arrays
        clearShoppingList() // clearing the innerhtml so that no new append is done while updating database
       for(let i = 0; i< arrayItems.length; i++){
        let currentItem = arrayItems[i]
        let currentItemID = currentItem[0]
        let currentItemValue = currentItem[1]
        appendItemToShoppingListEl(currentItem)
       }
    }
    else{
        shoppingListEl.innerHTML = "No enteries yet!!!!!"
    }
           
})

function clearShoppingList(){
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    // shoppingListEl.innerHTML += `<li>${itemValue}</li>`
    let newli = document.createElement("li")
    newli.textContent = itemValue
    shoppingListEl.append(newli)

    // add event listener in lsit so that user can delete it
    newli.addEventListener('dblclick', function(){
        let exaclocationinDB = ref(database, `shoppingList/${itemID}`) // providing exact location of list so that specific item is deleted
        remove(exaclocationinDB) // removing from database
    })
}


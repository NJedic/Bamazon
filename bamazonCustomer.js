//REQUIREMENTS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Require mysql
var mysql = require("mysql");
// Require inquirer
var inquirer = require("inquirer");
// Require colors
var colors = require("colors");


//STYLING
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
colors.setTheme({
	main:["rainbow", "bold"],
	title:["yellow", "bold"],
	header:"yellow",
	items:"green",
	error:["red", "bold"],
	purchase:["green", "bold"],
});

// APP FUNCTIONALITY
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Setting up the mysql connection function
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1234", //***Be sure to place your password here before attempting to run this code
  database: "bamazon_db" //***See "bamazonSchema.sql" to seed your database before you begin
});

// Connect to the database
connection.connect(function(err) {
  if (err) throw err;

  // Console.log the connection id to confirm connectivity
  console.log("connected as id " + connection.threadId + "\n");
  
 // Call the itemDisplay function 
  itemDisplay();
});

// This function displays all of the items Bamazon has in stock!
function itemDisplay(){
	connection.query("SELECT * FROM products", function(err, res){
		if (err) throw err;

		// Displaying the Title Blocck
		console.log("***********************************************************".main);
		console.log("+++++++++++++++++++*********************+++++++++++++++++++".main);
		console.log("++++++++++++++++++++".main + "Welcome to Bamazon!".title + "++++++++++++++++++++".main);
		console.log("+++++++++++++++++++*********************+++++++++++++++++++".main);
		console.log("***********************************************************".main);
		console.log("\nItems Currently in the Bamazon Database:".header);
		console.log("\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++".main);
		
		// Pulling the table data from the database and looping through it
		for (var i = 0; i < res.length; i++){

			//Console.log all of the data in an organized format so the user can "purchase" items
			console.log("\nProduct Id: ".items + res[i].item_id +  "\nProduct Name: ".items + res[i].product_name + "\nDepartment: ".items + res[i].department_name + "\nPrice: $".items + res[i].price + "\nQuantity in Stock: ".items + res[i].stock_quantity);
			console.log("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++".main);
		}

	// Calling the salePrompt function
	salePrompt();

	})
}

// This function walks the user through the ordering process!
function salePrompt(){
	// Inquirer is used to prompt the user...
	inquirer.prompt([
		//..on the Id of the product they want to purchase...
		{
			type:"input",
			message:"What is the Id of the Product You Would Like to Purchase?",
			name:"id",
				// Validating to make sure the input is a number
			validate: function(value) {
		    if (value && isNaN(value) === false) {
		      return true;
		    }
		    return false;
		  }
		},
		//..as well as how many of that item they would like.
		{
			type:"input",
			message:"How Many Units Would You Like to Purchase?",
			name:"units",
				// Validating to make sure the input is a number
			validate: function(value) {
		    if (value && isNaN(value) === false) {
		      return true;
		    }
		    return false;
		  }
		}
	// Once user data is captured...
	]).then(function(answer){
		//..connect to the database selecting the amount of the product in stock based on its id
		connection.query("SELECT stock_quantity, price FROM products WHERE ?", [{item_id: answer.id}], function(err, res){
			if (err) throw err;
			
			// If the amount the user wants is more than Bamazon has in stock...
			if(answer.units > res[0].stock_quantity){
				//..console.log that information to let the user know.
				console.log("Sorry, We Have an Insufficient Quantity of that Product to Fill Your Request. Please Try Again:".error);
				// Launch the salePrompt function so they can start their transaction again
				salePrompt();
			}

			// If the amount the user wants is less than Bamazon has in stock...
			else{
						// Variable represents the new number of items that will be in stock
				var updatedStock = res[0].stock_quantity - answer.units;
						// Variable represents the total the user will have to pay for their items
				var customerCost = res[0].price * answer.units;
						// Variable represents the id of the item the user wants to purchase
				var itemID = answer.id;
				//..update the table in the database to reflect the purchase
				connection.query("UPDATE products SET ? WHERE ?",
				  [
				    {
				      stock_quantity: updatedStock
				    },
				    {
				      item_id: itemID
				    }
				  ],
				  function(err, res) {
				  	if (err) throw err;
				  	// Console.log to let the user know the database has been updated and their purchase has gone through
				    console.log("Your order for ".purchase + res.affectedRows + " product is currently being processed!".purchase);
				  }
				);
				// Console.log the total amount owed to Bamazon for the user's purchase
				console.log("Thank you for your business! Your Total is: $".purchase + customerCost);
				
				// Call the itemDisplay function to see the updated inventory so the user may make another purchase
				itemDisplay();
			}

		})
	})
}

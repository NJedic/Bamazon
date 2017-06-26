//REQUIREMENTS AND VARIABLES
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Require mysql
var mysql = require("mysql");
// Require inquirer
var inquirer = require("inquirer");


var updatedStock = "";
var customerCost = "";
var itemID = "";

// Setting up the mysql connection function
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1234",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  
  // connection.destroy();
  itemDisplay();
});

function itemDisplay(){
	connection.query("SELECT * FROM products", function(err, res){
		if (err) throw err;

		console.log("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		console.log("\nItems Currently in the Bamazon Database:");
		console.log("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		for (var i = 0; i < res.length; i++){
			console.log("\nProduct Id: " + res[i].item_id +  "\nProduct Name: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: $" + res[i].price + "\nQuantity in Stock: " + res[i].stock_quantity);
			console.log("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		}
	// connection.destroy();

	salePrompt();

	})
}

function salePrompt(){
	inquirer.prompt([
		{
			type:"input",
			message:"What is the Id of the Product You Would Like to Purchase?",
			name:"id",
			validate: function(value) {
		    if (value && isNaN(value) === false) {
		      return true;
		    }
		    return false;
		  }
		},
		{
			type:"input",
			message:"How Many Units Would You Like to Purchase?",
			name:"units",
			validate: function(value) {
		    if (value && isNaN(value) === false) {
		      return true;
		    }
		    return false;
		  }
		}
	]).then(function(answer){
		connection.query("SELECT stock_quantity, price FROM products WHERE ?", [{item_id: answer.id}], function(err, res){
			if (err) throw err;
			// console.log(err);

			if(answer.units > res[0].stock_quantity){
				console.log("Sorry, We Have an Insufficient Quantity of that Product to Fill Your Request. Please Try Again:");
				salePrompt();
			}

			// else{
			// 	var updatedStock = res[0].stock_quantity - answer.units;
			// 	var customerCost = res[0].price * answer.units;
			// 	var itemID = answer.id;
			// 	updateStock();
			// }

			connection.destroy();
		})
	})
}

// function updateStock(){
// 	connection.query("UPDATE products SET ? WHERE ?",
// 		[
// 			{
// 				stock_quantity: parseInt(updatedStock)
// 			},
// 			{
// 				item_id: parseInt(itemID)
// 			}
// 		],
// 		function(err, res){
// 			if (err) throw err;
// 			console.log(err);

// 			console.log("Congratulations on your Purchase! Your Total Cost is $" + parseInt(customerCost));

// 		})
// }
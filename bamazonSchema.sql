-- File to create database and seed the products table

DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;


CREATE TABLE products (
	item_id INTEGER(50) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50) NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	price INTEGER(10),
	stock_quantity INTEGER(50) NOT NULL, 
	PRIMARY KEY (item_id)
);

ALTER TABLE products AUTO_INCREMENT=1001;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Extra Large Rubber Duck", "Toys & Games", 39, 15),
	("Pizza Slice Pet Costume", "Pet Supplies", 16, 42),
	("Tiki Drinking Glasses - set of 4", "Home & Kitchen", 20, 36),
	("Captain Marvel Beach Towel", "Outdoor Recreation", 19, 100),
	("Banana Saver with Carabiner", "Home & Kitchen", 9, 25),
	("Women's Novelty Mac & Cheese Crew Socks", "Clothing, Shoes, & Jewelry", 11, 200),
	("Cactus Beverage Cooler Ring Toss Game", "Toys & Games", 35, 2),
	("Hamburger Bean Bag Chair", "Home & Kitchen", 69, 10),
	("Astronaut Cat Crossbody Bag", "Clothing, Shoes, & Jewelry", 26, 1),
	("Giant Rainbow Unicorn Pool Float", "Outdoor Recreation", 80, 17),
	("Coconut Tree Print Hawaiian Shirt for Pets", "Pet Supplies", 8, 50),
	("Embroidered Pizza Slice Vintage Baseball Cap", "Clothing, Shoes, & Jewelry", 11, 87);

SELECT * FROM products;

-- ============================
-- CREATE DATABASE
-- ============================
CREATE DATABASE IF NOT EXISTS `e_commerce_db`;
USE `e_commerce_db`;

-- ============================
-- 1. tb_admin
-- ============================
CREATE TABLE tb_admin (
    adminID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- ============================
-- 2. tb_customer
-- ============================
CREATE TABLE tb_customer (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(250),
    phone VARCHAR(20)
);

-- ============================
-- 3. tb_category
-- ============================
CREATE TABLE tb_category (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status TINYINT(1) DEFAULT 1,
    description TEXT
);

CREATE TABLE tb_brand(
    brandID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status TINYINT(1) DEFAULT 1,
    description TEXT
);

-- ============================
-- 4. tb_product
-- ============================
CREATE TABLE tb_product (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stockQuantity INT NOT NULL DEFAULT 0,
    categoryID INT,
    brandID INT,
    FOREIGN KEY (categoryID)
        REFERENCES tb_category(categoryID)
        ON DELETE SET NULL,
    FOREIGN KEY (brandID)
        REFERENCES tb_brand(brandID)
        ON DELETE SET NULL
);

-- ============================
-- 5. tb_address
-- ============================
CREATE TABLE tb_address (
    addressID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zipCode VARCHAR(20),
    country VARCHAR(100),
    FOREIGN KEY (customerID)
        REFERENCES tb_customer(customerID)
        ON DELETE CASCADE
);

-- ============================
-- 6. tb_cart
-- ============================
CREATE TABLE tb_cart (
    cartID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT,
    FOREIGN KEY (customerID)
        REFERENCES tb_customer(customerID)
        ON DELETE SET NULL
);

-- ============================
-- 7. tb_order
-- ============================
CREATE TABLE tb_order (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending',
    orderAmount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (customerID)
        REFERENCES tb_customer(customerID)
        ON DELETE CASCADE
);

-- ============================
-- 8. tb_order_item
-- ============================
CREATE TABLE tb_order_item (
    orderItemID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT NOT NULL,
    productID INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderID)
        REFERENCES tb_order(orderID)
        ON DELETE CASCADE,
    FOREIGN KEY (productID)
        REFERENCES tb_product(productID)
        ON DELETE CASCADE
);

-- ============================
-- 9. tb_payment
-- ============================
CREATE TABLE tb_payment (
    paymentID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    paymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paymentMethod VARCHAR(50),
    status VARCHAR(50),
    FOREIGN KEY (orderID)
        REFERENCES tb_order(orderID)
        ON DELETE CASCADE
);

-- ============================
-- 10. tb_review
-- ============================
CREATE TABLE tb_review (
    reviewID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,
    productID INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    reviewDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerID)
        REFERENCES tb_customer(customerID)
        ON DELETE CASCADE,
    FOREIGN KEY (productID)
        REFERENCES tb_product(productID)
        ON DELETE CASCADE
);

-- ============================
-- tbl_user
-- ============================
DROP TABLE IF EXISTS `tbl_user`;
CREATE TABLE `tbl_user` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(250) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `password` TEXT NOT NULL,
  `photo` VARCHAR(255),
  `status` VARCHAR(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
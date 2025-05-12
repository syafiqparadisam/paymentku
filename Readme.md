# Paymentku

Paymentku is a payment application that makes it easy for users to perform various types of digital payments and transactions. This app offers various features for bill payments, top-ups, fund transfers, and tracking transaction history.

## Tech stacks
1. **ReactJS**: Frontend
2. **NestJS**: Auth service
3. **Golang**: History,transaction service
4. **Gofiber**: User service
5. **MySQL**: RDBMS
6. **Redis** Key-value DB



## Main Features

1. **Bill Payments**: Pay various bills such as electricity, water, and telephone easily and quickly.
2. **Game Payments**: Top-up for various popular gaming platforms.
3. **Wi-Fi Payments**: Pay for your Wi-Fi internet services.
4. **Fund Transfers**: Transfer funds to other Paymentku users or bank accounts.
5. **Top-Up**: Reload digital balances for various services such as e-wallets or mobile credit.
6. **Transaction History**: Monitor all top-up and transfer activities.
7. **Login and Registration**: Register and log in to your account easily to access all features.
8. **Logout**: Log out of your account securely.
9. **Delete Account**: Option to delete your account if you no longer wish to use Paymentku services.

## How to clone and run this project

### 1. Clone this repo
```
git clone https://github.com/syafiqparadisam/paymentku.git
```
or you may use other method to clone this repo

### 2. Install docker
you can install it on https://docs.docker.com/engine/install
### 3. Run docker compose
Open your terminal and paste 
```
make install

// Fill .env file first before running docker
make docker-compose
```
### 4. Run each service
Open your each session terminal and paste **ONE BY ONE**
```
make run-auth // auth service run
make run-user // user service run
make run-history // history service run
make run-transaction // transaction service run
make run-fe // frontend run
```
### 5. Open website
Open your website on http://localhost:5173


### How to run this project quickly

### 1. Install docker
you can install it on https://docs.docker.com/engine/install
### 2. Paste this code on your compose.yml
```

```

## Website Usage
### 1. Open the website
- *Link*: http://localhost:5173 

### 2. Registration and Login
- **Registration**: Create a new account by entering the required information such as email, phone number, and password.
- **Login**: Log in to your account with the registered email and password.

### 3. Making Payments
- **Bills**: Select the type of bill you want to pay, enter the necessary details, and confirm the payment.
- **Game**: Select the gaming platform, enter the game user ID, and choose the top-up amount.
- **Wi-Fi**: Enter the Wi-Fi service details and the payment amount you wish to make.

### 4. Fund Transfers
- Select the transfer option, enter the recipient's details (account number or phone number), enter the amount to be transferred, and confirm.

### 5. Top-Up
- Select the service you want to top-up, enter the necessary details, and confirm the top-up amount.

### 6. Transaction History
- Go to the "History" menu to view all the top-up and transfer transactions you have made.

### 7. Logout
- To log out of your account, open the profile menu and select "Logout".

### 8. Delete Account
- If you wish to delete your account, open the account settings menu and select "Delete Account". Please note that this action cannot be undone.

## Contact and Support

If you encounter any issues or have questions, please contact our email or dm me on instagram, i already provide on my bio.
Thank you for using Paymentku!


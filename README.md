# CRUD-app

## Introduction

This application is a simple JavaScript and HTML/CSS-based user data display and management system, which allows listing, searching, filtering, and validating of user data.

## Features

- Listing user data from the JSON server
- Searching and filtering user data
- Adding a new user by filling out the form, with data validation before submission
- Saving the new user's data on the JSON server

## Prerequisites

For the application to work, you will need Node.js and JSON Server, which you can install globally on your system with the following command:

npm install -g json-server

## Launch

Before you start the application, you first need to start the JSON Server so that it can access the data. You can do this with the following command:

json-server --watch .\MOCK_DATA.json

This will start the JSON Server on the MOCK_DATA.json file, which contains the user data.

## Using the Application

After you've started the JSON Server, open the application in a browser. The application will list user data and provide the ability to search and filter user data, as well as add a new user using the form. All fields on the form must be filled out, and the data provided will be validated before submission. The JSON Server will save the new user's data.

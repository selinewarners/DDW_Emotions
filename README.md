# Getting started with the Emotion Station

This repository is meant to be a starting point for prototypes for the **Emotion Station**. To get started, first make sure you have a copy of this repository on your computer. Also make sure you have a local server running (or set one up with [XAMPP](https://www.apachefriends.org/) or [MAMP](https://www.mamp.info/)). Place the copy of this repository in the document root (folder) of your local server and visit it within your browser.

Sit or stand in front of your camera and move around a bit to check if everything is working. If not, use the Inspector to check for errors and see if you can fix those or contact us on Slack.

There are comments within the code that clarify what is going on. Also, check the Output format down below to see what type of output you're dealing with. We divided the data gathering- which can be a little more complex- and the visual side of the javascript into two files. We suggest you start working in the **app.js** file. If you'd want to change something about how the data is gathered and/or returned, you should do that within the **data.js** file.

## Output format

This station returns an object with one or more expressions and their probability value. There is a threshold (set to 0.1 by default; probability values are normalized), which makes sure that all detectable expressions with a low probability won't get through.

## Browser support

This code was tested on Chrome. We suggest you develop in Google Chrome as well. This will avoid browser compatibility issues between projects.

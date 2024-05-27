# GitHub Event Notification System

This project is designed to monitor GitHub events for each guild's stored information and notify a Discord server whenever a new repository is created.

## Overview

The script utilizes GitHub's API to fetch public events for specified users and filters them to identify new repository creations. When a new repository event is detected, it constructs a notification message and sends it to the configured Discord channel.

## Setup

1. Ensure you have Node.js installed on your system.
2. Install the required dependencies using `npm i`.
3. Configure the script with appropriate GitHub and Discord credentials.
4. Run the script using `node index.js`.

## Usage

The script runs on a timed interval, periodically fetching GitHub events for each stored user in the database. Upon detecting a new repository creation event, it sends a notification to the configured Discord channel.

## Configuration

- GitHub API credentials:
  - `username`: GitHub username
  - `token`: Discord Bot Token
  - `guild`: Discord guild (server) ID
  - `channel`: Discord channel ID for notifications

## Script Logic

1. Fetch stored GitHub user information from the database.
2. Iterate over each user's stored information.
3. Fetch public GitHub events for the user.
4. Filter the events to identify new repository creation events.
5. If a new repository creation event is detected:
   - Construct a notification message.
   - Send the notification to the configured Discord channel.
   - Update the database with the timestamp of the latest processed event.

## Credits
This project was originally developed using SQLite but has been converted to use MongoDB. The Orginal Code
- The Orginal Code > [EyalGreennn/Github-Post-Notification](https://github.com/EyalGreennn/Github-Post-Notification)

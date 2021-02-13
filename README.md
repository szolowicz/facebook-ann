# facebook-ann

A multifunctional Facebook bot capable of conducting valuable conversations with users thanks to integration with natural language processing and machine learning solutions.

Bot can interpret messages sent by users and respond to them in accordance with the conversation model prepared and trained by the owner.
In the solution tested by us in vivo, the bot served prepared, static responses to messages,
but the accuracy of the matches was so great that hardly anyone from the research sample was able to indicate that they did not talk to a human.

## Features
* Browser emulating - GET/POST requests and tricking Facebook into thinking we're accessing the website normally.
* Integration with Dialogflow, which is at the heart of the project and is responsible for matching messages to the type of responses and machine learning through training and data.
* Bot recognizes the photos sent to it and replies with a message with what is in the photo.
* Bot replies realistically thanks to manipulation of the typing indicator, the response time and random seed are taken into account.

## Prerequisites to build
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/lang/en/)

## Getting started
```bash
# Clone repo
git clone https://github.com/Lumm1t/facebook-ann.git
cd facebook-ann/
yarn # or npm install
```

Set correct environment variables:
1. Rename `.env.example` to `.env`
2. Open `.env` and change data.

Set correct Dialogflow connection:
1. Rename `dialogflow.json.example` to `dialogflow.json`
2. Open `dialogflow.json` and change data.

## Run
```bash
- Normal
yarn app # or npm run app

- For hot module replacement:
yarn app:dev # or npm run app:dev
```

## Contributing
Pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)
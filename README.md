# URL Shortener Microservice

Add any valid URL to the path of this domain and you'll receive a shortened URL in a JSON response. Navigating to the shortened URL will redirect you to the original URL.

## Example

Let's say your server name is `short.site`. You can pass any valid URL as the first param in your browser.

`https://short.site/https://www.somesuperlongwebsite.com/it/just/keeps/going&going=forever&ever=there%20must%20be%20a%20better%20way`

Submitting this request to the server will return a JSON response with a new shortened link that will persist as long as the database is live. Submitting the link above will return: 
```json
{
  "__v": 0,
  "id": "jY73FvNy",
  "original_url": "https://www.somesuperlongwebsite.com/it/just/keeps/going&going=forever&ever=there%20must%20be%20a%20better%20way",
  "short_url": "short.site/B1P0re0s",
  "_id": "57d075cfb0d645f11a28e784"
}
```

Now, if you go to `https://sort.site/jY73FvNy`, you will get redirected to `https://www.somesuperlongwebsite.com/it/just/keeps/going&going=forever&ever=there%20must%20be%20a%20better%20way`. Much better!

If you're testing this out locally, the `short_url` property's value will be localhost/123abcYZ, but don't forget the port number when you try out the new shortened link. If `process.env.PORT` is undefined, the server will default to port 4000, so navigating to localhost:4000/123abcYZ will work.

## Installation

1. Clone this repository
2. NPM install

## Usage

1. Open a new terminal window in the root of the project and run:    
`npm run mongo`    
This will start a local instance of mongodb. Make sure you have a directory named `data` in the root of your project. Keep this terminal open, and run the following command in a second terminal.
2. `gulp serve`    
This will initiate gulp to start the express server along with nodemon.


.
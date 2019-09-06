# What is React Trello Client?
This is a simple and lightweight React plugin to have a clean Trello client without using jQuery or any other additional libraries.

## Features  🔥

* Easy to use without confusion
* Most client.js options as component props
* Default login button with custom text and multiple Trello button styles
* Option to disabling default button
* Have Authorize on component load
* Authorization box behavior controll (Popup or Redirect)
* Control access permission scopes (Read, Write, Account information)
* Set Expiration time available
* Callback functions as props
* Clean and well optimized code
* Well documented options

## Install 💻
Simply run the following command. You should install as a dependency by `--save` or `-S` flag.
```sh
npm i --save react-trello-client
```

## Options ⚙

You can pass available options as props to the main component. See [Usage](#Usage)

**Example:**
```jsx
<TrelloClient authorizeType="popup">
```

**Available options:**

Prop | Type | Required | Description | Example |
---- | ---- | -------- | ----------- | ------- |
**apiKey** | String | Yes | The API key your got from trello. Get the API key from [https://trello.com/app-key/](https://trello.com/app-key/) | `apiKey="19194867c53e814486de9e5636734e11"` |
**clientVersion** | Number | Yes | Trello API version you are using | `clientVersion={1}`
**apiEndpoint** | String | Yes | Trello API endpoint url | `apiEndpoint="https://api.trello.com"`
**authEndpoint** | String | Yes | Trello authorization endpoint | `authEndpoint="https://trello.com"`
**intentEndpoint** | String | Yes | Trello intent endpoint | `intentEndpoint="https://trello.com"`
**authorizeName** | String | Yes | Name of your application to show on authorization poprop or page | `authorizeName="React Trello Login"`
**authorizeType** | String | No | Select how to show the authorization window. available options are `popup` and `redirect`. Default is `popup` | `authorizeType="popup"`
**authorizePersist** | Boolean | No | Allow to write token on local storage if authentication is succeed. Default is `true` | `authorizePersist={true}`
**authorizeInteractive** | Boolean | No | Set interactive mode on or off. Default is `true` | `authorizeInteractive={true}`
**authorizeScopeRead** | Boolean | No | Get permission to read all user boards and teams. Default is `true` | `authorizeScopeRead={true}`
**authorizeScopeWrite** | Boolean | No | Get permission to make comment for the user, create and update cards, lists, boards and teams of the user. Default is `false` | `authorizeScopeWrite={false}`
**authorizeScopeAccount** | Boolean | No | Get permission to read user email address. Default is `false` | `authorizeScopeAccount={false}`
**authorizeExpiration** | String | No | Set the permission expiry time. You can pass options such as `"1hour"`, `"15hours"`, `"1day"`, `"30days"` or `"never"` | `authorizeExpiration="25days"`
**authorizeOnSuccess** | Function | Yes | A function to call after login is succeed | `authorizeOnSuccess={() => console.log('Login failed!')}`
**authorizeOnError** | Function | Yes | A function to call after login is failed | `authorizeOnError={() => console.log('Login error!')}`
**autoAuthorize** | Boolean | No | Authorization window will show up right after component is loaded. Default is `false` | `autoAuthorize={false}`
**authorizeButton** | Boolean | No | If it's `true` Default login button with Trello styles will show. Default is `false` | `authorizeButton={true}`
**buttonStyle** | String | No | Login button style. Available options are `metamorph` and `flat`. Default is `metamorph` | `buttonStyle="metamorph"`
**buttonColor** | String | No | Login button style. Available options are `green`, `grayish-blue` and `light`. Default is `green` | `buttonColor="grayish-blue"`
**buttonText** | String | No | The text to show on login button. Default is `Login with Trello` | `buttonText="Login with Trello"`
**ButtonCustomStyles** | Object | No | You can override the button default styles with a JS style object. This adds a `style` attribute to the button with the given values | `buttonCustomStyles={{ background: blue, marginLeft: '15px' }}`

## Usage 🍷
Usage of the plugin is so simple. Just import it then pass required props. Please pay attetion to required ones.

**Example:**
```jsx
import React from 'react'
import TrelloClient from 'react-trello-client`

const App = () => {
    return(
        <TrelloClient
            apiKey="19194867c53e814486de9e5636734e11"
            clientVersion={1} // number: {1}, {2}, {3}
            apiEndpoint="https://api.trello.com" // string: "https://api.trello.com"
            authEndpoint="https://trello.com" // string: "https://trello.com"
            intentEndpoint="https://trello.com" // string: "https://trello.com"
            authorizeName="Trellog" // string: "React Trello Client"
            authorizeType="popup" // string: popup | redirect
            authorizePersist={true}
            authorizeInteractive={true}
            authorizeScopeRead={false} // boolean: {true} | {false}
            authorizeScopeWrite={true} // boolean: {true} | {false}
            authorizeScopeAccount={true} // boolean: {true} | {false}
            authorizeExpiration="never" // string: "1hour", "1day", "30days" | "never"
            authorizeOnSuccess={() => console.log('Login failed!')} // function: {() => console.log('Login failed!')}
            authorizeOnError={() => console.log('Login error!')} // function: {() => console.log('Login error!')}
            autoAuthorize={false} // boolean: {true} | {false}
            authorizeButton={true} // boolean: {true} | {false}
            buttonStyle="metamorph" // string: "metamorph" | "flat"
            buttonColor="green" // string: "green" | "grayish-blue" | "light"
            buttonText="Login with Trello" // string: "Login with Trello"
        />
    )
}

export default App
```

**Note:**

If you disable the login button, its not necessary to declare button props. Even if you don't use `authorizeButton={false}` the default option `false` will be used.

**Example:**

```jsx
import React from 'react'
import TrelloClient from 'react-trello-client`

const App = () => {
    return(
        <TrelloClient
            apiKey="19194867c53e814486de9e5636734e11"
            clientVersion={1} // number: {1}, {2}, {3}
            apiEndpoint="https://api.trello.com" // string: "https://api.trello.com"
            authEndpoint="https://trello.com" // string: "https://trello.com"
            intentEndpoint="https://trello.com" // string: "https://trello.com"
            authorizeName="Trellog" // string: "React Trello Client"
            authorizeType="popup" // string: popup | redirect
            authorizePersist={true}
            authorizeInteractive={true}
            authorizeScopeRead={false} // boolean: {true} | {false}
            authorizeScopeWrite={true} // boolean: {true} | {false}
            authorizeScopeAccount={true} // boolean: {true} | {false}
            authorizeExpiration="never" // string: "1hour", "1day", "30days" | "never"
            authorizeOnSuccess={() => console.log('Login failed!')} // function: {() => console.log('Login failed!')}
            authorizeOnError={() => console.log('Login error!')} // function: {() => console.log('Login error!')}
            autoAuthorize={false} // boolean: {true} | {false}
        />
    )
}

export default App
```

##
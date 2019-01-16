import React, {Component} from 'react';


class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    }
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");
    this.socket.onmessage = (event) => {
      // console.log(event.data)
      let incomingMessage = JSON.parse(event.data);
      console.log("incomingMessage ",incomingMessage);

      let oldAndNewMessages = this.state.messages.concat(incomingMessage);

      // console.log("incoming ",incomingMessage);
      // console.log("oldAndNewMessages ",oldAndNewMessages);
      this.setState({
        messages: oldAndNewMessages
      });

      console.log(this.state)
    }

  } //componentDidMount Closes here.

  getValue(value){
  // send to server state msg
    // console.log("testing ",value)
    let newMessage = {
      currentUser: this.state.currentUser.name,
      content: value
    };
    // console.log(newMessage)
    this.socket.send(JSON.stringify(newMessage));

  }

  render() {

    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <main className="messages">
          <MessageList messages={this.state.messages} username={this.state.currentUser.name}/>
        </main>
        <ChatBar user={this.state.currentUser} getValue={this.getValue.bind(this)}/>
      </div>
    )
  }
}

class ChatBar extends Component {
  constructor(props){
    super(props);

    this.state = {
      currentUser: this.props.user,
      //content: ""
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

handleKeyPress = (event) => {
  if(event.key == "Enter"){

    let content = event.target.value;
    // console.log('content',content);

    //this.props.getValue(this.state);
    this.props.getValue(content);

    // console.log('enter press here! ')
    // console.log(event.target.value)
    event.target.value = '';

  }
}

  render(){
    const currentUser = this.props.user;


    return(
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={currentUser.name} />
        <input className="chatbar-message" onKeyPress={this.handleKeyPress} placeholder="Type a message and hit ENTER" />
      </footer>
    )
  }
}

class MessageList extends Component {
  constructor(props){
    super(props)

  }

  render(){
    const messagesFromApp = this.props.messages;
    // const usernameFromApp = this.props.username;
    const msgsArray = messagesFromApp.map((msg) => {
      return <Message key={msg.id} message={msg.content} username={msg.currentUser}/>
     })

    return(
      <main className="messages">
        <h1> underone </h1>
        { msgsArray }
        <div className="message system">
          Anonymous1 changed their name to nomnom.
        </div>
      </main>
    )
  }
}

class Message extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <div className="message">
        <span className="message-username">{this.props.username}</span>
        <span className="message-content">{this.props.message}</span>
      </div>
    )
  }
}


export default App;

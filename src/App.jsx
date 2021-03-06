import React, {Component} from 'react';


class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      notification: "",
      counter: 0
    }
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");
    this.socket.onmessage = (event) => {

      let incomingMessage = JSON.parse(event.data);

      // RECEIVIMG MSG AND NOTIFICATION AND OTHER STUFF

      let oldAndNewMessages = this.state.messages.concat(incomingMessage);

      if (incomingMessage.type === "message") {
      // IF TYPE MESSAGE DO THIS
        this.setState({
          messages: oldAndNewMessages
        });
      } else if (incomingMessage.type === "notification") {
        // IF TYPE NOTIFICATION DO THIS
          this.setState({
            notification: incomingMessage.content
          });
      } else if (incomingMessage.type === "onlineUser") {
          this.setState({
            counter: incomingMessage.counter
          });
      }
    }

  } //componentDidMount Closes here.

  getContent(value){
  // send to server state msg
    let newMessage = {
      currentUser: this.state.currentUser.name,
      content: value,
      type: "message"
    };
    this.socket.send(JSON.stringify(newMessage));
  }

  getUsername(value){

    const oldUsername = this.state.currentUser.name;
    const newUsername = value;
    const content = oldUsername +" changed his name to "+newUsername;

    console.log(content);
    const newNotification = {
      content: content,
      currentUser: this.state.currentUser.name,
      type: "notification"
    }

    this.socket.send(JSON.stringify(newNotification));
    this.setState({
      currentUser: {name: newUsername},
      notification: content
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <p className="userOnline">{this.state.counter} Users Online</p>
        </nav>
        <main className="messages">
          <MessageList messages={this.state.messages} username={this.state.currentUser} notification={this.state.notification} />
        </main>
        <ChatBar getUsername={this.getUsername.bind(this)} getContent={this.getContent.bind(this)}/>
      </div>
    )
  }
} //App component closes here

class ChatBar extends Component {
  constructor(props){
    super(props);

    this.state = {
      currentUser: {name: this.props.user},
    }
    this.handleContent = this.handleContent.bind(this);
  }

  handleUsername = (event) => {
    if(event.key == "Enter"){
      let username = event.target.value;
      this.props.getUsername(username);
    }
  };

  handleContent = (event) => {
    if(event.key == "Enter"){
      let content = event.target.value;

      this.props.getContent(content);
      event.target.value = '';
    }
  }

  render(){
    return(
      <footer className="chatbar">
        <input className="chatbar-username" onKeyPress={this.handleUsername} placeholder="Your Name (Optional)" defaultValue="Anonymous" />
        <input className="chatbar-message" onKeyPress={this.handleContent} placeholder="Type a message and hit ENTER" />
      </footer>
    )
  }
} //Chatbar component closes here.

class MessageList extends Component {
  constructor(props){
    super(props)
  }

  render(){
    const messagesFromApp = this.props.messages;
    const msgsArray = messagesFromApp.map((msg) => {
      return <Message key={msg.id} message={msg.content} username={msg.currentUser}/>
     })

    return(
      <main className="messages">
        { msgsArray }
        <div className="message system">
          { this.props.notification }
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

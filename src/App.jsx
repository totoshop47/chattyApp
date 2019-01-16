import React, {Component} from 'react';


class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      notification: ""
    }
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");
    this.socket.onmessage = (event) => {
      // console.log(event.data)
      let incomingMessage = JSON.parse(event.data);

      // RECEIVIMG MSG AND NOTIFICATION AND OTHER STUFF

      // console.log("incomingMessage ",incomingMessage);

      let oldAndNewMessages = this.state.messages.concat(incomingMessage);

      // console.log("incoming ",incomingMessage);
      // console.log("oldAndNewMessages ",oldAndNewMessages);


      if (incomingMessage.type === "message") {
      // IF TYPE MESSAGE DO THIS
        console.log('is Message')
        this.setState({
          messages: oldAndNewMessages
        });
    } else if (incomingMessage.type === "notification") {
      // IF TYPE NOTIFICATION DO THIS
        console.log('notiication data', incomingMessage.content)
        this.setState({
          notification: incomingMessage.content
        })
        console.log('is Notification')
    }







      // console.log(this.state)
    }

  } //componentDidMount Closes here.

  getContent(value){
  // send to server state msg
    // console.log("testing ",value)
    let newMessage = {
      currentUser: this.state.currentUser.name,
      content: value,
      type: "message"
    };
    // console.log(newMessage)
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

    // let newUser = {

    //   currentUser: value,

    // };
    // // console.log(newMessage)
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
      //content: ""
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
      // console.log('content',content);

      //this.props.getValue(this.state);
      this.props.getContent(content);

      // console.log('enter press here! ')
      // console.log(event.target.value)
      event.target.value = '';

    }
  }
  render(){


    return(
      <footer className="chatbar">
        <input className="chatbar-username" onKeyPress={this.handleUsername} placeholder="Your Name (Optional)" defaultValue="test" />
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
    // const usernameFromApp = this.props.username;
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

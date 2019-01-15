import React, {Component} from 'react';


class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          id: 1,
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          id: 2,
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        },
      ]
    }
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);
  }

  getValue(value){
    console.log(value);
    this.setState({messages: this.state.messages.concat({
          id: 1,
          username: "Bob",
          content: value,
        })});
  }

  render() {

    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <main className="messages">
            <MessageList messages={this.state.messages} />
        </main>
        <ChatBar user={this.state.currentUser} getValue={this.getValue.bind(this)}/>
      </div>
    )
  }
}

class ChatBar extends Component {
  // constructor(props){
  //   super(props);

  //   // this.handleKeyPress = this.handleKeyPress.bind(this);
  // }
  render(){
    const currentUser = this.props.user;
    const handleKeyPress = (event) => {
      if(event.key == "Enter"){
        console.log('enter press here! ')
        console.log(event.target.value)
        this.props.getValue(event.target.value);
        event.target.value = ''
      }
    }

    return(
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={currentUser.name} />
        <input className="chatbar-message" onKeyUp={handleKeyPress} placeholder="Type a message and hit ENTER" />
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
    const msgsArray = messagesFromApp.map( (msg, index) => {
      return <Message key={index} message={msg.content} username={msg.username}/>
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

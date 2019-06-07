import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Logo from './components/Logo/Logo.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import Predictions from './Predictions.js'

import './App.css';




const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}


const initialState = {
      input: '',
      predict: ['Welcome to the MagicBall app! Here you can upload an image-URL and get predictions for anyone whose face is on the picture. Make sure that you can see a person\'s face on the picture that you want to submit. Even though MagicBall is extremely powerful it will only give predictions for the first 5 faces on the picture that it likes. After you find a picture on the internet that you like you should right click on it and pick an option “Open Image in New Tab”. Copy the image link from the browser and past it below. Good luck :)'],
      imageURL: '',
      box: {},
      route: 'signin',
      // route: 'home',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }

class App extends Component {

  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }


  calculateFaceLocation = (data) => {
    // console.log(data.outputs[0].data.regions);
    let array = data.outputs[0].data.regions.map(region => {
      const clarifaiFace = region.region_info.bounding_box;
      // console.log(`here is every region`,clarifaiFace);
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return ({
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
      })
    })
    return array;
  }




  //   calculateFaceLocation = (data) => {
  //   console.log(data.outputs[0].data.regions);
  //   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  //   const image = document.getElementById('inputimage');
  //   const width = Number(image.width);
  //   const height = Number(image.height);
  //   return {
  //     leftCol: clarifaiFace.left_col * width,
  //     topRow: clarifaiFace.top_row * height,
  //     rightCol: width - (clarifaiFace.right_col * width),
  //     bottomRow: height - (clarifaiFace.bottom_row * height)
  //   }
  // }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  generatePredictions = (data) => {

    const getRandomInt = (max) => {
      return Math.floor(Math.random() * Math.floor(max));
    }

    console.log(data.outputs[0].data.regions.length);
    console.log("predictions",Predictions);
    console.log("predictions length",Predictions.length);
    let numOfFaces = data.outputs[0].data.regions.length;
    let numOfPredict = Predictions.length;

    if (numOfFaces>5) 
      numOfFaces=5;
    

    let currentPredicts = [];
    for (let i = 0; i<numOfFaces; i++) {
      currentPredicts[i] = Predictions[getRandomInt(numOfPredict)];
    }
    console.log('currentPredicts', currentPredicts);

    let stringP = '';

    for (let i = 0; i<currentPredicts.length; i++) {
      stringP += ( (i+1) + ') ' +  currentPredicts[i]+' \n')
    }

    this.setState({predict: stringP});

    console.log(stringP);


  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
      fetch('https://aqueous-wave-42318.herokuapp.com/imageurl', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
              },
            body: JSON.stringify({
              input: this.state.input
            })
          })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://aqueous-wave-42318.herokuapp.com/image', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json'
              },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response));
        this.generatePredictions(response);
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route==='signout'){
      this.setState(initialState)
    } else if (route==='home'){
      this.setState({isSignedIn:'true'})
    }
    this.setState({route: route});
  }


  render() {
    const { isSignedIn,imageURL, route, box} = this.state;
    return (
      <div className="App">
        <Particles className='particles' 
              params={particlesOptions}
          />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home' 
            ?<div> 
              <div>
                <Logo predict={this.state.predict}/>
              </div>
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition imageURL={imageURL} box={box}/>  

             </div>
            : (
               route ==='signin' 
               ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
               : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

              )
        }
      </div>
    );
  }  
}

export default App;

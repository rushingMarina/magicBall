import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Logo from './components/Logo/Logo.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import './App.css';

const app = new Clarifai.App({
 apiKey: 'cc857fb29d96497a8e161a602eb5e653'
});


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


class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }


  calculateFaceLocation = (data) => {
    console.log(data.outputs[0].data.regions);
    let array = data.outputs[0].data.regions.map(region => {
      const clarifaiFace = region.region_info.bounding_box;
      console.log(`here is every region`,clarifaiFace);
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

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route==='signout'){
      this.setState({isSignedIn: false})
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
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition imageURL={imageURL} box={box}/>  
             </div>
            : (
               route ==='signin' 
               ? <Signin onRouteChange={this.onRouteChange} />
               : <Register onRouteChange={this.onRouteChange} />

              )
        }
      </div>
    );
  }  
}

export default App;

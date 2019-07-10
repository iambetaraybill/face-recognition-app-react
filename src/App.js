////////////////////////////////////////////////////////////////
////////////Created By : Arpan Sarkar///////////////////////////
///////////Licence : MIT ///////////////////////////////////////
////////////////////////////////////////////////////////////////


import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


const app = new Clarifai.App({
  apiKey: 'YOUR_API_KEY_HERE'
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
      input: "",
      imageurl: '',
      box: {}
    }
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const heigth = Number(image.height);
    console.log(width, heigth);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * heigth,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: heigth - (clarifaiFace.bottom_row * heigth)

    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  }


  onInputChange = (event) => {

    this.setState({ input: event.target.value });
  }
  onButtonSubmit = () => {
    console.log('click');
    this.setState({ imageurl: this.state.input });

    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input).then(
        response =>
          this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));

  }
  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />

        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit} />

        <FaceRecognition box={this.state.box} imageurl={this.state.imageurl} />
      </div>
    );
  }
}

export default App;

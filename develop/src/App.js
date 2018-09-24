import React, { Component } from 'react';
import ShaderMaker from './Handle/ShaderMaker';
class App extends Component {
  componentDidMount() {
    const target = document.getElementsByClassName('bg')[0];
    new ShaderMaker(target);
  }
  render() {
    return <div className="App">
      <div className='bg'></div>
      <ul className='nav'>
        <li className='nav-prev'></li>
        <li className='nav-next'></li>
      </ul>
      <ul className="slider">
        <li className='slider-ele'>
          <h2 className='slider-ele-h2'>massa sapien faucibus et</h2>
          <p className='slider-ele-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </li>
        <li className='slider-ele'>
          <h2 className='slider-ele-h2'>tellus cras adipiscing</h2>
          <p className='slider-ele-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </li>
        <li className='slider-ele'>
          <h2 className='slider-ele-h2'>etiam non quam lacus suspendisse</h2>
          <p className='slider-ele-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </li>
        <li className='slider-ele'>
          <h2 className='slider-ele-h2'>nunc sed blandit libero</h2>
          <p className='slider-ele-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </li>
      </ul>
    </div>;
  }
}

export default App;

import React from 'react';
import Tilt from 'react-tilt';
import fortune from './crystal-ball.png'
import './Logo.css'

const Logo = ({predict}) => {
	return (
		<div>
		<div className='ma4 mt0 line'>
			<Tilt className="Tilt br2 shadow-2 pa3 ma0" options={{ max : 50 }} style={{ height: 150, width: 150}} >
			<div className="Tilt-inner"> 
				<img style={{paddingTop: '3px'}} alt='logo' src={fortune}/> 
			</div>
			</Tilt>
		</div>
		<article className="center1 mw5 mw6-ns hidden ba mv4 b--light-purple">
		  <h1 className="f4 bg-light-purple white mv0 pv2 ph3">Magic Ball Predictions</h1>
		  <div className="pa3 bt b--light-purple">
		    <p className="f6 f5-ns lh-copy measure mv0">{predict}</p>
		  </div>
		</article>
		</div>

	);
}

export default Logo;
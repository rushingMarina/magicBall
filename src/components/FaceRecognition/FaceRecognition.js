import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageURL, box}) => {
	console.log(box);
	let box1 = Array.from(box);
	let mappedBox = box1.map((singleBox, id) => {
		console.log(id);
		// return (
		// 	<div 
		// 		key={id}
		// 		className="bounding-box"
		// 		style={{
		// 			top: singleBox.topRow, 
		// 			right: singleBox.rightCol, 
		// 			bottom: singleBox.bottomRow, 
		// 			left: singleBox.leftCol
		// 		}} 
		// 	/> 
		// 	)
		return (
			<div key={id}
				className="bounding-box"
				style={{
					top: singleBox.topRow, 
					right: singleBox.rightCol, 
					bottom: singleBox.bottomRow, 
					left: singleBox.leftCol
				}}> 
				<div className="number-box">{id}</div>
			</div>

			)


	})
	console.log(`mappedBox`,mappedBox);

	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputimage' alt='' src={imageURL} width='500px' height='auto'/>
				<div className='bounding-box-set'>{mappedBox}</div>
			</div>
		</div> 
	);

	// return (
	// 	<div className='center ma'>
	// 		<div className='absolute mt2'>
	// 			<img id='inputimage' alt=''src={imageURL} width='500px' height='auto'/>
	// 			<div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
	// 		</div>
	// 	</div>
	// );
}

export default FaceRecognition;
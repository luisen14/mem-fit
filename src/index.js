import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import QuizzGame from './arithmetic';

ReactDOM.render(<QuizzGame />, document.getElementById('root'));
registerServiceWorker();

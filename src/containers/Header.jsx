import React from 'react'; // eslint-disable-line no-unused-vars

import Counter from '../components/Counter';
import ResetButton from '../components/ResetButton';
import Timer from '../components/Timer';

// import styles from './Header.css';

const Header = () => (
    <div>
        <Timer />
        <ResetButton />
        <Counter />
    </div>
);

export default Header;

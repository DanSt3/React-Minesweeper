import React, {Component} 'react'; // eslint-disable-line no-unused-vars

import cx from 'classnames';
import styles from './MyInput.css';

const MyInput = () => (
    <div>
        <input
          type="text"
          name="myInput"
          size="40"
          value="Text here"
          className={cx(styles.textColor, styles.margins)}
        />
    </div>
);

export default MyInput;

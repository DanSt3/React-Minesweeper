import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

// import styles from './Timer.css';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0,
        };
    }

    render() {
        const { seconds } = this.state;
        return (
            <div>
                {`Timer: ${seconds} sec`}
            </div>
        );
    }
}

export default Timer;

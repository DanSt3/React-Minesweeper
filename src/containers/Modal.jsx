import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Modal.css';

export default class Modal extends Component {
    static handleClicks(event) {
        // Don't let clicks propagate back to other elements!
        event.stopPropagation();
    }

    // Note we don't need to bind the click handler because we don't use "this" in it

    /* (doesn't need an interactive elements/accessibility - we want to ignore all clicks) */
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-noninteractive-tabindex,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
    render() {
        const { children, show } = this.props;
        return (
            (show)
                ? (
                    <div
                        className={styles.modalBackdrop}
                        onClick={this.handleClicks}
                    >
                        <div
                            className={styles.modalContent}
                            onClick={this.hanldleClicks}
                        >
                            {children}
                        </div>
                    </div>
                )
                : <div />
        );
    }
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-noninteractive-tabindex,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
}

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired,
};

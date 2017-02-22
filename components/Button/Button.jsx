import React from 'react';
import cx from 'classnames';
import s from './Button.css';

class Button extends React.Component {

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(option) {
    console.log("Clicked");
  }

  render() {
    return (
      <button
        className={cx(s.root)}
        onClick={this.handleClick}>
        <span className={s.inner}>{this.props.children}</span>
      </button>
    );
  }

}

export default Button;

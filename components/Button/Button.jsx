import React from 'react';
import cx from 'classnames';
import s from './Button.css';
import Link from '../Link';

class Button extends React.Component {

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.callback(this.props.id);
  }

  render() {

    let link = `#${this.props.id}`;
    if (this.props.to) {
      link = this.props.to;
    }

    /*
     <Link
     to={link}
     className={cx(s.root)}
     onClick={this.handleClick}>
     */
    return (
      <Link
        to={link}
        className={cx(s.root)}
        onClick={this.handleClick}>
        <span className={s.inner}>{this.props.children}</span>
      </Link>
    );
  }

}

export default Button;

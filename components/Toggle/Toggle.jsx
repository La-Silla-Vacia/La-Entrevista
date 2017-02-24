import React from 'react';
import cx from 'classnames';
import s from './Toggle.css';

class Toggle extends React.Component {

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      open: false
    }
  }

  handleClick() {
    this.setState({open: !this.state.open})
  }

  render() {

    let contentStyle = {
      maxHeight: '0'
    };

    if (this.state.open) {
      contentStyle = {
        maxHeight: '300px'
      }
    }

    return (
      <div className={cx(s.root, {[s.open]: this.state.open})}>
        <button className={cx(s.button)} onClick={this.handleClick}>
          <span className={s.title}>{this.props.title}</span>
        </button>
        <section className={s.content} style={contentStyle}>
          <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Donec sed odio dui. Sed posuere consectetur est at lobortis.</p>
        </section>
      </div>
    );
  }

}

export default Toggle;

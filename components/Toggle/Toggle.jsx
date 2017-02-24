import React from 'react';
import cx from 'classnames';
import s from './Toggle.css';

class Toggle extends React.Component {

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      open: false,
      height: false
    }
  }

  handleClick() {
    this.setState({open: !this.state.open})
  }

  componentDidMount() {
    this.setState({open: true});
    setTimeout(() => {
      const height = this.refs.toggle.offsetHeight;
      this.setState({height});
      this.setState({open: false});
    }, 50);
  }

  render() {

    let contentStyle = {
      maxHeight: 0
    };

    if (this.state.open) {
      let height = 2000;
      if (this.state.height) {
        height = this.state.height;
      }
      contentStyle = {
        maxHeight: height
      }
    }

    return (
      <div ref="toggle" className={cx(s.root, {[s.open]: this.state.open})}>
        <button className={cx(s.button)} onClick={this.handleClick}>
          <span className={s.title}>{this.props.title}</span>
        </button>
        <section className={s.content} style={contentStyle}>
          <p>{this.props.content}</p>
        </section>
      </div>
    );
  }

}

export default Toggle;

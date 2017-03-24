import React from 'react';
import s from './SideButtons.css';

class SideButtons extends React.Component {

  handleClick(id) {
    this.props.callback(id)
  }

  getButtons() {
    return this.props.data.map((item, index) => {
      return (
        <li onClick={this.handleClick.bind(this, item.id)} key={index} className={s.item}>
          <span className={s.bullet} />
          <div className={s.content}>{item.title}</div>
        </li>
      )
    });
  }

  render() {
    const buttons = this.getButtons();
    return (
      <ul className={s.root}>
        {buttons}
      </ul>
    )
  }
}

export default SideButtons;

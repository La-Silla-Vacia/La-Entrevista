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
          <span className={s.title}>Wat zijn de AIVD en de MIVD?</span>
        </button>
        <section className={s.content} style={contentStyle}>
          <p>De AIVD (Algemene Inlichtingen- en Veiligheidsdienst) is een van de twee geheime diensten van Nederland. De AIVD moet ervoor zorgen dat er in Nederland bijvoorbeeld geen aanslagen plaatsvinden. De zusterorganisatie van de AIVD, de MIVD (Militaire Inlichtingen- en Veiligheidsdienst), richt zich vooral op de veiligheid van militaire operaties. Bij de AIVD werken 1300 mensen; bij de MIVD ruim 850.</p>
        </section>
      </div>
    );
  }

}

export default Toggle;

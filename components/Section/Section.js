import React, {PropTypes} from 'react';
import cx from 'classnames';
import s from './Section.css';

class Section extends React.Component {

  static propTypes = {
    select: PropTypes.node,
    children: PropTypes.node,
  };

  render() {

    let headerStyles = {};
    if (this.props.image) {
      headerStyles = {
        backgroundImage: `url(${this.props.image})`
      }
    }

    let header = (
      <h2 className={s.defaultTitle}>{this.props.title}</h2>
    );
    if (this.props.type !== "simple") {
      header = (
        <header className={s.header} style={headerStyles}>
          <div className={s.headerInner}>
            <h2 className={s.title}>{this.props.title}</h2>
            <div className={s.lead} dangerouslySetInnerHTML={{__html: this.props.intro}}/>
          </div>
        </header>
      );
    }

    let id = "";
    if (this.props.id) id = `section-${this.props.id}`;

    let content = (
      <div className={cx(s.content, {[s['cols_' + this.props.cols]]: this.props.cols})}
           dangerouslySetInnerHTML={{__html: this.props.content}}/>
    );
    if (this.props.children) {
      content = (
        <div className={cx(s.content, {[s['cols_' + this.props.cols]]: this.props.cols})}>
          {this.props.children}
        </div>
      );
    }

    return (
      <section id={id}
               className={cx(s.root, {[s.simple]: this.props.type === 'simple'}, {[s.root__full_width]: this.props.fullWidth})}>
        <div className={s.inner}>
          {header}
          <div className={s.contentWrap}>
            {content}
          </div>
        </div>
      </section>
    );
  }

}

export default Section;

import React, {PropTypes} from 'react';
import cx from 'classnames';
import s from './Section.css';
import Toggle from '../Toggle';
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

class Section extends React.Component {

  static propTypes = {
    select: PropTypes.node,
    children: PropTypes.node,
  };

  preg_replace(pattern, replace, subject, limit) {
    void 0 === limit && (limit = -1);
    let e = pattern.substr(pattern.lastIndexOf(pattern[0]) + 1),
      f = pattern.substr(1, pattern.lastIndexOf(pattern[0]) - 1),
      g = RegExp(f, e), i = [], j = 0, k = 0, l = subject, m = [];

    if (-1 === limit) {
      do m = g.exec(subject), null !== m && i.push(m); while (null !== m && -1 !== e.indexOf("g"))
    } else i.push(g.exec(subject));
    for (j = i.length - 1; j > -1; j--) {
      for (m = replace, k = i[j].length; k > -1; k--) {
        // m = m.replace("${" + k + "}", i[j][k]).replace("$" + k, i[j][k]).replace("\\" + k, i[j][k]);
      }
      l = l.replace(i[j][0], m)
    }
    return l
  }

  markdown_parser(str) {

    const rules = [
      // headers
      ['/(#+)(.*)/g', (chars, header) => {
        const level = chars.length;
        return '<h' + level + '>' + header.trim() + '</h' + level + '>';
      }],
      // images
      ['/\\!\\[([^\\[]+)\\]\\(([^\\(]+)\\)/g', '<img src=\"\\2\" alt=\"\\1\" />'],
      // link
      ['/\\[([^\\[]+)\\]\\(([^\\(]+)\\)/g', (str) => {
      // console.log(str);
        let split = str.split('[');
        const before = split[0];

        let newSplit = split[1].split(']');
        let text = newSplit[0];

        let link = newSplit[1].split(')')[0].replace('(', '');
        // console.log(link);
        const after = newSplit[1].split(')')[1];
        return ( <p>{before} <a href={link}>{text}</a> {after}</p> );
      }],
      // bold
      ['/(\\*\\*|__)(.*?)\\1/g', '<strong>\\2</strong>'],
      // emphasis
      ['/(\\*|_)(.*?)\\1/g', (line) => {
        const key = Math.floor(Math.random() * 100000);
        const str = line.replace('*', '').replace('*', '');
        return (
          <h3 key={key}>{str}</h3>
        )
      }],
      // strike
      ['/(\\~\\~)(.*?)\\1/g', '<del>\\2</del>'],
      // quote
      ['/\\:\\"(.*?)\\"\\:/g', '<q>\\1</q>'],
      // unordered list
      ['/\\n\\*(.*)/g', (item) => {
        return '<ul>\n<li>' + item.trim() + '</li>\n</ul>';
      }],
      // ordered list
      ['/\\n[0-9]+\\.(.*)/g', (item) => {
        return '<ol>\n<li>' + item.trim() + '</li>\n</ol>';
      }],
      // blockquote
      ['/\\n\\>(.*)/g', (str) => {
        const key = Math.floor(Math.random() * 10000);
        const allContent = str.trim().replace('>', '');
        const contentChuncked = allContent.split(':');
        const title = contentChuncked[0];
        const content = contentChuncked[1];
        return (<Toggle key={key} title={title} content={content} />);
      }],
      // paragraphs
      ['/\\n[^\\n]+\\n/g', (line) => {
        line = line.trim();
        const key = Math.floor(Math.random() * 10000);
        return (<p key={key}>{line.trim()}</p>);
      }]
    ], fixes = [
      ['/<\\/ul>\n<ul>/g', '\n'],
      ['/<\\/ol>\n<ol>/g', '\n'],
      ['/<\\/blockquote>\n<blockquote>/g', "\n"]
    ];

    const parse_line = (str) => {
      str = "\n" + str.trim() + "\n";
      for (let i = 0, j = rules.length; i < j; i++) {
        if (typeof rules[i][1] == 'function') {
          const _flag = rules[i][0].substr(rules[i][0].lastIndexOf(rules[i][0][0]) + 1),
            _pattern = rules[i][0].substr(1, rules[i][0].lastIndexOf(rules[i][0][0]) - 1),
            reg = new RegExp(_pattern, _flag);

          const matches = reg.exec(str);
          if (matches !== null) {
            str = rules[i][1](str, i);
          }
        }
        else {
          str = this.preg_replace(rules[i][0], rules[i][1], str);
        }
      }
      return str;
    };

    str = str.split('\n');
    return str.map((string, index) => {
      const formatted = parse_line(string);
      if (formatted)
        return formatted;
    });
  };

  componentDidUpdate() {
    jQuery(".toggle-container").each(function() {
      var $this = jQuery(this);
      var button;
      if ($this.find('.toggle').length) {
        button = $this.find('.toggle');
      } else {
        var text = $this.text();
        var title = text.split(':')[0];
        var body = text.split(':')[1];
        $this.html(`<button class="toggle">${title}<img src="https://la-entrevista.firebaseapp.com/images/toggle.svg" alt=""/></button><div class="toggle-content">${body}</div>`);
        button = $this.find('.toggle');
      }

      var open = false;
      var $toggle = $this.find('.toggle');
      var $content = $this.find('.toggle-content');
      button.click(function() {
        if (!open) {
          $content.slideDown();
          open = true;
          $this.addClass('open');
        } else {
          $content.slideUp();
          open = false;
          $this.removeClass('open');
        }
      });
    })
  }

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
        <header className={s.header}>
          <div className={s.header__background} style={headerStyles}/>
          <div className={s.headerInner}>
            <h2 className={s.title}>{this.props.title}</h2>
            <div className={s.lead} dangerouslySetInnerHTML={{__html: this.props.intro}}/>
          </div>
        </header>
      );
    }

    let id = "";
    if (this.props.id) id = `section-${this.props.id}`;

    let col1Formatted,
      col2Formatted;
    if (this.props.content) {
      // console.log(this.markdown_parser('Por desgracia son las dos condiciones, no hay confianza ni visión. En una presentación que hice en un foro de la [Revista Semana](https://www.youtube.com/watch?v=JozLa_hqaZ8&feature=youtu.be) señalaba que el país tenía cuatro condiciones hoy día.'));

      //col1Formatted = this.markdown_parser(this.props.content.col1);
      //col2Formatted = this.markdown_parser(this.props.content.col2);
      col1Formatted = md.render(this.props.content.col1);
      col2Formatted = md.render(this.props.content.col2);

      col1Formatted = col1Formatted.replace('<blockquote>', '<div class="toggle-container">').replace('</blockquote>', '</div>');
      col2Formatted = col2Formatted.replace('<blockquote>', '<div class="toggle-container">').replace('</blockquote>', '</div>');

      // console.log(contentFormatted);
    }
    let content = (
      <div className={cx(s.content)}>
        <div className={s.column} dangerouslySetInnerHTML={{__html: col1Formatted}} />
        <div className={s.column} dangerouslySetInnerHTML={{__html: col2Formatted}} />
      </div>
    );
    if (this.props.children) {
      content = (
        <div className={cx(s.content, {[s['cols_' + this.props.cols]]: this.props.cols})}>
          {this.props.children}
        </div>
      );
    }

    let credits;
    if (this.props.imageCredits) {
      credits = (
        <small className={s.credits}>{this.props.imageCredits}</small>
      );
    }

    return (
      <section id={id}
               className={cx(
                 s.root,
                 {[s.simple]: this.props.type === 'simple'},
                 {[s.root__full_width]: this.props.fullWidth},
                 {[s.smallHeight]: this.props.smallHeight}
                 )}>
        <div className={s.inner}>
          {header}
          <div className={s.contentWrap}>
            {credits}
            {content}
          </div>
        </div>
      </section>
    );
  }

}

export default Section;

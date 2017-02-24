import React from 'react';
import 'whatwg-fetch';
import cx from 'classnames';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import Section from '../../components/Section';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import s from './styles.css';
import {title, html} from './index.md';
const jsx = require('markdown-it-jsx');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt().use(jsx);

class HomePage extends React.Component {

  constructor() {
    super();

    this.state = {
      data: [],
      openSection: []
    };

    this.activateSection = this.activateSection.bind(this);
  }

  componentDidMount() {
    document.title = title;

    this.getData();
  }

  getData() {
    fetch('https://la-entrevista.firebaseio.com/data.json')
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        const data = [];
        json.map((single) => {
          const newSingle = {
            id: single.id,
            type: single.type,
            image: single.image,
            title: single.title,
            intro: md.render(single.intro),
            text: {
              col1: single.textCol1,
              col2: single.textCol2
            },
            hidden: true
          };
          data.push(newSingle);
        });
        this.setState({data});
      })
      .catch((ex) => {
        console.log('parsing failed', ex)
      })
  }

  getSections() {
    if (!this.state.data.length) return;
    return this.state.data.map((single, index) => {
      return (
        <Section
          id={single.id}
          title={single.title}
          intro={single.intro}
          image={single.image}
          content={single.text}
          cols="2"
          key={index}
          fullWidth
          smallHeight
        />
      )

    });
  }

  getButtons() {
    return this.state.data.map((single, index) => {
      return (
        <Button
          key={index}
          id={single.id}
          to={`#section-${single.id}`}
          callback={this.activateSection}>
          {single.title}
        </Button>
      )
    });
  }

  scrollTo(element, target, duration) {
    target = Math.round(target);
    duration = Math.round(duration);
    if (duration < 0) {
      return Promise.reject("bad duration");
    }
    if (duration === 0) {
      element.scrollTop = target;
      return Promise.resolve();
    }

    const start_time = Date.now();
    const end_time = start_time + duration;

    const start_top = element.scrollTop;
    const distance = target - start_top;

    // based on http://en.wikipedia.org/wiki/Smoothstep
    const smooth_step = function (start, end, point) {
      if (point <= start) {
        return 0;
      }
      if (point >= end) {
        return 1;
      }
      const x = (point - start) / (end - start); // interpolation
      return x * x * (3 - 2 * x);
    };

    return new Promise(function (resolve, reject) {
      // This is to keep track of where the element's scrollTop is
      // supposed to be, based on what we're doing
      let previous_top = element.scrollTop;
      // This is like a think function from a game loop
      const scroll_frame = function () {
        // if (element.scrollTop != previous_top) {
        //   reject("interrupted");
        //   return;
        // }

        // set the scrollTop for this frame
        const now = Date.now();
        const point = smooth_step(start_time, end_time, now);
        const frameTop = Math.round(start_top + (distance * point));
        element.scrollTop = frameTop;

        // check if we're done!
        if (now >= end_time) {
          resolve();
          return;
        }

        // If we were supposed to scroll but didn't, then we
        // probably hit the limit, so consider it done; not
        // interrupted.
        if (element.scrollTop === previous_top
          && element.scrollTop !== frameTop) {
          resolve();
          return;
        }
        previous_top = element.scrollTop;

        // schedule next frame for execution
        setTimeout(scroll_frame, 0);
      }

      // boostrap the animation process
      setTimeout(scroll_frame, 0);
    });
  }

  activateSection(id) {
    if (!id) return;
    const section = document.getElementById(`section-${id}`);
    const sectionOffset = section.offsetTop;
    this.scrollTo(document.body, sectionOffset, 1000)
  }

  componentWillReceiveProps() {
    const id = this.props.route.params.id;
    // this.setState({openSection: [id]});
    this.activateSection(id)
  }

  render() {
    const stuff = this.getSections();
    const buttons = this.getButtons();

    let hidden = false;
    let link = "";
    if (this.props.route.params.id) {
      hidden = true;
      link = (<Link to="/" className={s.backButton}>Back to overview</Link>);
    }

    return (
      <Layout>
        <div className={cx(s.root, {[s.root__hidden]: hidden})}>
          <div className={s.background} style={{backgroundImage: "url(https://la-entrevista.firebaseapp.com/images/index_background.jpg)"}}/>
          <div className={s.content} dangerouslySetInnerHTML={{__html: html}}/>
          {link}
        </div>
        <Section
          title="Quick go to a section:"
          cols="3"
          type="simple">
          {buttons}
        </Section>
        { stuff }
      </Layout>
    );
  }

}

export default HomePage;

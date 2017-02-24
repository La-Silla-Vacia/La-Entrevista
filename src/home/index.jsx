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

  getSections(id) {
    if (!this.state.data.length) return;
    return this.state.data.map((single, index) => {
      let activeSectionArray = [this.state.openSection];
      if (!id && this.props.route.params.id) {
        activeSectionArray = this.props.route.params.id;
        if (activeSectionArray.indexOf(single.id) !== -1) {
          return this.createSection(single, index);
        }
      } else {
        console.log(activeSectionArray, single.id);
        if (id == single.id) {
          return setTimeout(() => {
            return this.createSection(single, index);
          }, 500);
        }
      }
      // if (this.props.route.params.id) {
      //   activeSectionArray = this.props.route.params.id;
      // }


    });
  }

  createSection(single, index) {
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
      />
    )
  }

  getButtons() {
    return this.state.data.map((single, index) => {
      return (
        <Button
          key={index}
          id={single.id}
          callback={this.activateSection}>
          {single.title}
        </Button>
      )
    });
  }

  activateSection(id) {
    // const offsetTop = window.scrollY;
    // for (let i = 0; i < offsetTop; i++) {
    //   setTimeout(() => {
    //     document.body.scrollTop -= 1;
    //   }, i * 1.1);
    // }
    document.body.style.opacity = 0;
    this.setState({openSection: id});
    setTimeout(() => {
      document.body.scrollTop = 0;
      document.body.style.opacity = 1;
    }, 1000);
    // this.setState({openSection: [id]});
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
          <div className={s.background}
               style={{backgroundImage: "url(https://la-entrevista.firebaseapp.com/images/index_background.jpg)"}}/>
          <div className={s.content} dangerouslySetInnerHTML={{__html: html}}/>
          {link}
        </div>
        { stuff }
        <Section
          title="What do you want to read?"
          cols="3"
          type="simple">
          {buttons}
        </Section>
      </Layout>
    );
  }

}

export default HomePage;

import React from 'react';
import 'whatwg-fetch';
import cx from 'classnames';
import Layout from '../../components/Layout';
import Section from '../../components/Section';
import Button from '../../components/Button';
import SideButtons from '../../components/SideButtons';
import s from './styles.css';
import {title, html} from './index.md';
const jsx = require('markdown-it-jsx');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt().use(jsx);

class HomePage extends React.Component {

  constructor() {
    super();
    let dataUri = 'https://la-entrevista.firebaseio.com/data.json';
    if (typeof window.sillaInteractiveData === 'object') {
      const sillaInteractiveData = window.sillaInteractiveData;
      if (typeof sillaInteractiveData.dataUri == 'string') {
        dataUri = sillaInteractiveData.dataUri;
      }
    }

    this.state = {
      data: [],
      mainTitle: [],
      dataUri: dataUri,
      openSection: []
    };

    this.activateSection = this.activateSection.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetch(this.state.dataUri)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        const data = [];
        const mainTitle = [];
        json.map((single) => {
          let credits = '';
          if (single.imageCredits) credits = single.imageCredits;

          const newSingle = {
            id: single.id,
            type: single.type,
            image: single.image,
            title: single.title,
            intro: md.render(single.intro),
            imageCredits: credits,
            text: {
              col1: single.textCol1,
              col2: single.textCol2
            },
            hidden: true
          };
          if (single.type == 'default') {
            data.push(newSingle);
          } else if (single.type == 'maintitle') {
            mainTitle.push(newSingle);
          }
        });
        this.setState({data, mainTitle});
      })
      .catch((ex) => {
        console.log('parsing failed', ex)
      })
  }

  getSections() {
    if (!this.state.data.length) return;
    return this.state.data.map((single, index) => {
      if (single.type !== 'default') return;
      return (
        <Section
          id={single.id}
          title={single.title}
          intro={single.intro}
          image={single.image}
          content={single.text}
          imageCredits={single.imageCredits}
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
      if (single.type !== 'default') return;
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

  activateSection(id) {
    if (!id) return;
    jQuery('html, body').animate({ scrollTop: jQuery(`#section-${id}`).offset().top }, 1000);
  }

  componentWillReceiveProps() {
    const id = this.props.route.params.id;
    // this.setState({openSection: [id]});
    this.activateSection(id)
  }

  render() {
    const stuff = this.getSections();
    const buttons = this.getButtons();

    let backgroundImage;
    let content;
    if (this.state.mainTitle[0]) {
      const mainTitle = this.state.mainTitle[0];
      backgroundImage = mainTitle.image;
      content = `<h1>${mainTitle.title}</h1>${mainTitle.intro}`;
    } else if (this.state.data.length) {
      content = html;
      backgroundImage = 'http://archivo.lasillavacia.com/archivos/historias/backgrounds/66.jpg';
    }

    let intro = (
      <div className={cx(s.root)}>
        <div className={s.background}
             style={{backgroundImage: `url(${backgroundImage})`}}/>
        <div className={s.content} dangerouslySetInnerHTML={{__html: content}}/>
      </div>
    );

    return (
      <Layout>
        {intro}
        <Section
          title="Seleccione el tema de su interés:"
          cols="3"
          type="simple">
          {buttons}
        </Section>

        <SideButtons
          data={this.state.data}
          callback={this.activateSection}
        />

        { stuff }
      </Layout>
    );
  }
}

export default HomePage;

import React from 'react';
import 'whatwg-fetch';
import Layout from '../../components/Layout';
import Section from '../../components/Section';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import s from './styles.css';
import {title, html} from './index.md';

const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

class HomePage extends React.Component {

  constructor() {
    super();

    this.state = {
      data: []
    }
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
            text: md.render(single.text)
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
        />
      )
    });
  }

  getButtons() {
    return this.state.data.map((single, index) => {
      return (
        <Button key={index}>{single.title}</Button>
      )
    });
  }

  render() {

    const stuff = this.getSections();

    const buttons = this.getButtons();

    return (
      <Layout>
        <div className={s.root} style={{backgroundImage: "url(/images/index_background.jpg)"}}>
          <div className={s.content} dangerouslySetInnerHTML={{__html: html}}/>
        </div>
        <Section
          title="What do you want to see?"
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

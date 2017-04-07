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
      subTitle: [],
      dataUri: dataUri,
      openSection: [],
      authorInfo: {}
    };

    this.activateSection = this.activateSection.bind(this);
  }

  getAuthorData() {
    const mainAuthorBox = jQuery('.result.perfil');
    const authorBox = jQuery('.author.author-top');
    let author, subtitle, follow, followText, image, date;

    if (mainAuthorBox.length) {
      image = mainAuthorBox.find('> .img-container > img').attr('src');
      author = mainAuthorBox.find('> h6').html();
      subtitle = mainAuthorBox.find('> .subtitle').html();
      follow = mainAuthorBox.find('.flag-wrapper > a').attr('href');
      followText = mainAuthorBox.find('.flag-wrapper > a').text();
      this.setState({
        authorInfo: {
          author,
          subtitle,
          follow,
          followText,
          image
        }
      })
    } else
    if (authorBox.length) {
      author = authorBox.find('.editor > p > span:first-child').html();
      date = authorBox.find('.editor > p > span:nth-child(2)').html();
      this.setState({
        authorInfo: {
          author,
          date
        }
      })
    }
  }

  componentDidMount() {
    this.getAuthorData();
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
        const subTitle = [];
        json.map((single) => {
          // console.log(single);
          let credits = '';
          if (single.imageCredits) credits = single.imageCredits;

          const newSingle = {
            id: single.id.replace('#', ''),
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
          } else if (single.type == 'subtitle') {
            subTitle.push(newSingle);
          }
        });
        this.setState({data, mainTitle, subTitle});
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

  getAuthorInfo() {

    let image, description, follow;
    if (this.state.authorInfo) {
      const info = this.state.authorInfo;
      if (info.image) {
        image = (
          <figure className={s.author_image}>
            <img
              src={info.image}
              alt={info.author} />
          </figure>
        )
      }

      if (info.author) {
        description = (
          <div className={s.author_description}>
            <h6 dangerouslySetInnerHTML={{__html: info.author}} />
            <span className={s.author_subtitle}>{info.date}</span>
            <span className={s.author_subtitle}>{info.subtitle}</span>
          </div>
        )
      }

      if (info.follow) {
        follow = (
          <div className={s.followBtn}>
            <a
              href={info.follow}
              title=""
              rel="nofollow">{info.followText}</a>
          </div>
        )
      }
    }

    return (
      <div className={s.author}>
        <div className={s.author_container}>
          {image}
          {description}
        </div>
        {follow}
        <div className="clearfix" />
      </div>
    )
  }

  activateSection(id) {
    if (!id) return;
    jQuery('html, body').animate({scrollTop: jQuery(`#section-${id}`).offset().top}, 1000);
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
        <div className={s.center}>
          <div className={s.content} dangerouslySetInnerHTML={{__html: content}}/>
          {this.getAuthorInfo()}
          <small className={s.disclaimer}>*Este es un espacio de opinión y debate. El contenido de los artículos refleja
            únicamente la opinión personal de sus autores y no compromete el de La Silla Vacía ni a los patrocinadores
            de esta red
          </small>
        </div>
      </div>
    );

    let subtitle;
    if (this.state.subTitle.length) {
      const subtitleData = this.state.subTitle[0].intro;
      subtitle = (
        <div className={s.subtitle}>
          <div className={s.subtitleText} dangerouslySetInnerHTML={{ __html: subtitleData }} />
        </div>
      )
    }

    return (
      <Layout>
        {intro}

        {subtitle}
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

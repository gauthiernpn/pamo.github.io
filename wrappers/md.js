import React from 'react';
import Helmet from 'react-helmet';
import ReadNext from 'components/ReadNext';
import { rhythm } from 'utils/typography';
import { config } from 'config';
import filter from 'lodash/filter';
import { prune, include as includes } from 'underscore.string';
import { prefixLink } from 'gatsby-helpers';
import SocialNetworks from 'components/SocialNetworks';
import ProfileImage from 'components/ProfileImage';
import Cover from 'components/Cover';
import { Container } from 'react-responsive-grid';

import 'css/zenburn.css';
import 'css/markdown.scss';

const MarkdownWrapper = (props) => {
  const { route } = props;
  const post = route.page.data;
  const pageUrl = config.blogUrl.slice(0, config.blogUrl.length-1) + prefixLink(route.page.path);
  let shortDescription = prune(post.body.replace(/<[^>]*>/g, ''), 100).trim();
  const imageTagRegex = /<img\b[^>]+?src\s*=\s*['"]?([^\s'"?#>]+)/i;
  const imageMatch = (post.body).match(imageTagRegex);

  let header = <Cover title={post.title} />;

  let coverImagePath;
  if (imageMatch) {
    coverImagePath = pageUrl + imageMatch[1];
  }

  if (post.coverPhoto) {
    coverImagePath = pageUrl + post.coverPhoto;
    header = <Cover title={post.title} image={post.coverPhoto} />;
  } else if (post.coverPhoto !== '' && imageMatch) {
    header = <Cover title={post.title} image={imageMatch[1]} />;
  }

  let readNextPost;
  if (post.layout === 'post') {
    const blogPosts = filter(route.pages, page => includes(page.requirePath, 'blog/'));
    readNextPost = <ReadNext post={post} pages={blogPosts} />;
  } else if (post.layout === 'travel') {
    post.title += ' travel guide.';
    shortDescription = `${post.title} ${shortDescription}`;
  }

  return (
    <div>
      <Helmet
        meta={[
          { property: 'og:url', content: pageUrl },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: post.title },
          { property: 'og:description', content: shortDescription },
          { property: 'og:image', content: coverImagePath },
          { name: 'description', content: shortDescription },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:site', content: config.authorTwitter },
          { name: 'twitter:creator', content: config.authorTwitter },
          { name: 'twitter:title', content: post.title },
          { name: 'twitter:description', content: shortDescription },
          { name: 'twitter:image', content: coverImagePath },
        ]}
        title={`${config.blogTitle} :: ${post.title}`}
      />
      { header }
      <Container
        style={{
          maxWidth: rhythm(24),
          padding: rhythm(1),
          margin: 'auto',
        }}
      >
        <div className="markdown" dangerouslySetInnerHTML={{ __html: post.body }} />
        {readNextPost}
        <hr />
        <div className="author">
          <ProfileImage />
          <div className="author__intro">When not crafting an
            artisinal vimrc, <strong>{config.authorName}</strong> can be found drinking coffee,
            riding a bike, climbing fake rocks, lifting heavy things, and, in general, wandering
          </div>
        </div>
        <SocialNetworks />
      </Container>
    </div>
  );
};

MarkdownWrapper.propTypes = {
  route: React.PropTypes.object,
};

export default MarkdownWrapper;

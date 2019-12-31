import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { searchImage } from '../../actions/search';
import Gallery from '../../components/Gallery/Gallery';
import css from './SearchImage.module.css';

export class SearchImage extends Component {
  loadImages(page) {
    const { searchTerm, searchImage } = this.props;
    searchImage(page, searchTerm);
  }

  render() {
    const { searchTerm, searchData } = this.props;
     const head = <Helmet>
        <title>Freemage - Search image</title>
        <meta name="description" content="Search any image by their tags" />
      </Helmet>

    return (
      <>
      {head}
        <header className={css.Header}>
          <h1>
            Search result for :{'  '}
            <span className={css.BigText}>"{searchTerm}"</span>
          </h1>
        </header>
        <hr />
        <Gallery
          curPage={searchData ? searchData.pagination.curPage : 0}
          hasMore={searchData ? searchData.pagination.hasMore : true}
          fetchNext={this.loadImages.bind(this)}
          images={searchData ? searchData.images : []}
        />
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const searchTerm = ownProps.match.params.searchTerm.trim();
  let searchData = state.search;

  if (searchData.searchTerm !== searchTerm) {
    searchData = null;
  }
  return {
    searchTerm,
    searchData
  };
};

const mapDispatchToProps = { searchImage };

export default connect(mapStateToProps, mapDispatchToProps)(SearchImage);

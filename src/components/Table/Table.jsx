import PropTypes, { string } from 'prop-types';
import React, { Component } from 'react';
import './Table.scoped.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Buttons/Button/Button';
import Dropdown from '../Dropdown/Dropdown';
import { Redirect, withRouter } from 'react-router';

const config = require('../../data.config');

class Table extends Component {
  constructor(props) {
    super(props);

    this.fields = config.ordering.donors;
    this.tables = config.tables;
    this.endColNum = 6;
    this.state = {
      height: 0,
      currentPage: 1,
      numOfPages: 1,
      itemsPerPage: Math.floor((window.innerHeight - 250) / 40),
      isRedirect: false,
    };
  }

  componentDidMount() {
    const temp = sessionStorage.getItem('pageDetails');
    const loadedData = JSON.parse(temp);
    if (loadedData) {
      const { currentPage, numOfPages, itemsPerPage } = loadedData;
      this.setState({ currentPage, numOfPages, itemsPerPage });
    } else {
      const height = window.innerHeight;
      const currentPage = 1;
      const itemsPerPage = Math.floor((height - 250) / 40);
      const numOfPages = Math.ceil(this.props.data.length / itemsPerPage);

      this.setState({ currentPage, itemsPerPage, numOfPages });
      const pageDetails = JSON.stringify({
        currentPage,
        itemsPerPage,
        numOfPages,
      });

      sessionStorage.setItem('pageDetails', pageDetails);
    }
    window.addEventListener('resize', this.updateHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeight);
  }

  componentDidUpdate(prevProps, prevState) {
    const { numOfPages, currentPage } = this.state;

    if (prevState.numOfPages !== numOfPages && currentPage > numOfPages) {
      this.setState({ currentPage: numOfPages });
    }
  }

  handleLeftClick = () => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage > 1 ? prevState.currentPage - 1 : 1,
    }));
  };

  handleRightClick = () => {
    const { numOfPages } = this.state;

    this.setState((prevState) => ({
      currentPage:
        prevState.currentPage < numOfPages
          ? prevState.currentPage + 1
          : numOfPages,
    }));
  };

  sliceItems = (data, itemsPerPage, currentPage) => {
    currentPage--;
    let start = itemsPerPage * currentPage;
    let end = start + itemsPerPage;
    let paginatedItems = data.slice(start, end);
    return paginatedItems;
  };

  updateHeight = () => {
    const { height, currentPage } = this.state;
    const { data } = this.props;

    this.setState({ height: window.innerHeight });

    const itemsPerPage = Math.floor((height - 250) / 40);
    const numOfPages = Math.ceil(data.length / itemsPerPage);
    if (itemsPerPage >= 0) {
      this.setState({ currentPage, itemsPerPage, numOfPages });
    }
  };

  redirectToView = (id) => {
    const { history, data, setViewedData } = this.props;

    // Set viewedData state in App
    const viewedData = data.find((obj) => obj.id == id);
    setViewedData(viewedData);

    // Redirect to view with ID == id
    history.push(`view/1?id=${id}`);
  };

  render() {
    const { currentPage, numOfPages, itemsPerPage, isRedirect } = this.state;
    const { data, currentTable } = this.props;

    const items = this.sliceItems(data, itemsPerPage, currentPage);

    if (isRedirect) {
      this.setState({ isRedirect: false });
      return <Redirect to="/view" />;
    }
    return (
      <table className="table">
        <thead id="table__top">
          <tr className="table__topRow flex--horizontal">
            <td className="flex--horizontal">
              <div className="table__flags flex--horizontal">
                {this.tables.map((table) => {
                  if (
                    table ===
                    currentTable.charAt(0).toUpperCase() + currentTable.slice(1)
                  ) {
                    return (
                      <div
                        key={table}
                        className="table__flag flex--horizontal flag--active"
                      >
                        <span>{table}</span>
                      </div>
                    );
                  } else {
                    return (
                      <div key={table} className="table__flag flex--horizontal">
                        <span>{table}</span>
                      </div>
                    );
                  }
                })}
              </div>
            </td>
            <td className="table__pagination flex--horizontal">
              <Button isTransparent>
                <FontAwesomeIcon
                  icon="arrow-left"
                  onClick={this.handleLeftClick}
                />
              </Button>
              <span>
                <sup>{currentPage}</sup>&frasl;<sub>{numOfPages}</sub>
              </span>
              <Button isTransparent onClick={this.handleRightClick}>
                <FontAwesomeIcon icon="arrow-right" />
              </Button>
            </td>
          </tr>
        </thead>
        <thead id="table__middle" className="flex--horizontal">
          <tr>
            <td className="flex--horizontal">
              <div className="flex--horizontal">
                <Button isTransparent message="Import" type="left">
                  <FontAwesomeIcon icon="file-upload" />
                </Button>
                <Button isTransparent message="Export" type="left">
                  <FontAwesomeIcon icon="file-download" />
                </Button>
                <Dropdown
                  title="Dropdown"
                  list={['#', 'Donor Name', 'Email Address Address Address']}
                />
                <Button isTransparent message="Sort" type="center">
                  <FontAwesomeIcon icon="sort" />
                </Button>
              </div>
              <div className="flex--horizontal">
                <Button isTransparent message="Add Entry" type="right">
                  <FontAwesomeIcon icon="plus" />
                </Button>
              </div>
            </td>
          </tr>
        </thead>
        <thead id="table__bottom">
          <tr className="table__bottomRow">
            {this.fields.slice(0, this.endColNum).map((col) => (
              <th style={{ width: col.width }} key={col.key}>
                {col.name}
              </th>
            ))}
            <th style={{ width: '50px' }} />
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr data-id={row.id} key={row.id}>
              {this.fields.slice(0, this.endColNum).map((col) => {
                if (col.key === '#') {
                  return (
                    <td style={{ width: col.width }} key={col.key}>
                      {i + 1}
                    </td>
                  );
                }

                return (
                  <td style={{ width: col.width }} key={col.key}>
                    {row[col.key]}
                  </td>
                );
              })}
              <td style={{ width: '50px' }}>
                <div className="flex--horizontal">
                  <Button
                    isTransparent={false}
                    message="View"
                    type="right"
                    onClick={() => this.redirectToView(row.id)}
                  >
                    <FontAwesomeIcon icon="border-all" />
                  </Button>
                  <Button isTransparent={false} message="Delete" type="right">
                    <FontAwesomeIcon icon="times" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withRouter(Table);

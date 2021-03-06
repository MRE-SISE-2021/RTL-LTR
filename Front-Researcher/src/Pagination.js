import React from "react";
import PropTypes from "prop-types";
import "./styles/Pagination.css";
import { ProgressBar, Button } from "react-bootstrap";
import GetByLang from "./langs/GetByLang";
const propTypes = {
  items: PropTypes.array.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
};

const defaultProps = {
  initialPage: 1,
  pageSize: 2,
};

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pager: {} };
  }

  componentWillMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
  }

  setPage(page) {
    var { items, pageSize } = this.props;
    var pager = this.state.pager;

    if (page < 1 || page > pager.totalPages) {
      return;
    }

    // get new pager object for specified page
    pager = this.getPager(items.length, page, pageSize);

    // get new page of items from items array
    var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // update state
    this.setState({ pager: pager });

    // call change page function in parent component
    this.props.onChangePage(pageOfItems);
  }

  getPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || 10;

    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);

    var startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    var pages = [...Array(endPage + 1 - startPage).keys()].map(
      (i) => startPage + i
    );

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }
  render() {
    var pager = this.state.pager;
    // console.log(pager);
    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
    }
    const percentage = ((pager.currentPage - 1) / pager.totalPages) * 100;
    let current = pager.currentPage - 2;
    let total = pager.totalPages - 2;

    return (
      <div>
        <div id="pagination">
          {pager.currentPage === 1 ? (
            <Button
              style={{ width: "30%" }}
              onClick={() => this.setPage(pager.currentPage + 1)}
            >
              {GetByLang.getLangStart(this.props.lang)}
            </Button>
          ) : pager.currentPage < pager.totalPages - 1 ? (
            // <li>
            <Button
              style={{ width: "30%" }}
              // className="item-page"
              onClick={() => this.setPage(pager.currentPage + 1)}
            >
              {GetByLang.getLangNext(this.props.lang)}
            </Button>
          ) : pager.currentPage < pager.totalPages ? (
            // </li>
            // <li>
            <Button
              style={{ width: "30%" }}
              // className="item-page"
              onClick={() => this.setPage(pager.currentPage + 1)}
            >
              {GetByLang.getLangFinish(this.props.lang)}
            </Button>
          ) : // </li>
          null}
          {/* <li
          className={pager.currentPage === pager.totalPages ? "disabled" : ""}
        >
          <a
            className="item-page"
            onClick={() => this.setPage(pager.totalPages)}
          >
            Last
          </a>
        </li> */}
          {/* </ul> */}
          <br />
          <br />
          {/* <div > */}

          {/* </div> */}
        </div>
        {/* <ProgressBar
          className="progress"
          now={percentage}
          label={`${Math.round(percentage)}%`}
          animated
        /> */}
        {pager.currentPage > 2 && pager.currentPage < pager.totalPages ? (
          <p style={{ textAlign: "center" }}>
            {GetByLang.getLangPage(this.props.lang)[0]} {current}{" "}
            {GetByLang.getLangPage(this.props.lang)[1]} {total - 1}
          </p>
        ) : null}
      </div>
    );
  }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;

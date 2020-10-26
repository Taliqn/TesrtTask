import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';
import Loader from './Loader/Loader.js';
import Table from "./Table/Table";
import _ from 'lodash'
import DetailRowView from './DetailRowView/DetailRowView'
import ModeSelected from "./ModeSelected/ModeSelected";
import TableSerch from "./Tableserch/TableSerch";


class App extends Component {
    state = {
        isNodeSelected: false,
        isLoading: false,
        data: [],
        search: '',
        sort: 'asc', // desc
        sortField: 'id',
        row: null,
        currentPage: 0
    }

   async fetchData(url) {
      const response = await fetch(url)
      const data = await response.json()
    this.setState({
    isLoading: false,
    data: _.orderBy(data, this.state.sortField, this.state.sort)
    })
}

onSort = sortField => {
    const cloneData = this.state.data.concat()
    const sortType = this.state.sort === "asc" ? "desc" : "asc"
    const ordereData = _.orderBy(cloneData, sortField, sortType)
    this.setState({
        data: ordereData,
        sort: sortType,
        sortField
    })
}

    modeSelectHandler = url => {
       this.setState({
           isNodeSelected: true,
           isLoading: true
       })
        this.fetchData(url)
    }

    onRowSelect = row => {
        this.setState({row})
    }

    pageChangeHandler = ({selected}) => {
        this.setState({currentPage: selected})
    }

    searchHandler = search => {
        this.setState({search, currentPage: 0})
    }

    getFilteredData() {
        const {data, search} = this.state
        if (!search) {
            return data

        } 

        return data.filter(item => {
            return item['firstName'].toLowerCase().includes(search.toLowerCase())
                || item['lastName'].toLowerCase().includes(search.toLowerCase())
                || item['email'].toLowerCase().includes(search.toLowerCase())
                || item['phone'].toLowerCase().includes(search.toLowerCase())
        })

    }

    render() {
        const pageSize = 50
        if (!this.state.isNodeSelected) {
            return (
                <div className='Container'>
                    <ModeSelected onSelect={this.modeSelectHandler}/>
                </div>
            )
        }

        const filteredData = this.getFilteredData()

        const pageCount = Math.ceil(filteredData.length / pageSize)

        const displayData = _.chunk(filteredData, pageSize) [this.state.currentPage]

        return (
        <div className="Container">
            {
                this.state.isLoading
                ? <Loader/>
                : <React.Fragment>
                    <TableSerch onSearch={this.searchHandler}/>
                        <Table
                            data={displayData || []}
                            onSort={this.onSort}
                            sort={this.state.sort}
                            sortField={this.state.sortField}
                            onRowSelect={this.onRowSelect}
                            />
                    </React.Fragment>


            }

            {this.state.data.length > pageSize
            ?  <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.pageChangeHandler}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    pageClassName='page-item'
                    pageLinkClassName='page-link'
                    previousClassName='page-item'
                    nextClassName='page-item'
                    previousClassName='page-link'
                    nextLinkClassName='page-link'
                    forcePage={this.state.currentPage}
                /> : null
            }

            {
                this.state.row
                ? <DetailRowView person={this.state.row} />
                : null
            }
        </div>
    );
  }
  }

export default App;
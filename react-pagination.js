import React, { Component } from 'react';
import PropTypes from 'proptypes';

export default class Pagination extends Component {
    constructor(props) {
        super();
    }

    componentWillMount(){
        this.initState();
    }

    componentWillReceiveProps(props){
        this.initState(props);
    }

    render(){
        const {pageSize, totalCount} = this.props,
            {pn, pageCount} = this.state;
        const mapBtn = (i) => {
            return <a className={pn === i ? 'curr' : ''} onClick={this.clickBtn.bind(this, i)} key={i}>{i}</a>;
        }

        // 全部显示
        if(pageCount < 8){
            let _paginate = []
            for(let i=0; i<pageCount; i++){
                _paginate.push(i+1);
            };

            return (
                <div>
                    <a onClick={this.clickBtn.bind(this, pn > 1 ? pn - 1 : 1)}>上一页</a>
                    {
                        _paginate.map(mapBtn)
                    }
                    <a onClick={this.clickBtn.bind(this, pn < pageCount ? pn + 1 : pageCount)}>下一页</a>
                    共{totalCount}条数据
                </div>
            );
        }

        return (
            <div>
                <a onClick={this.clickBtn.bind(this, pn > 1 ? pn - 1 : 1)}>上一页</a>
                {
                    [1, 2, 3].map(mapBtn)
                }
                {
                    pn === 4 ? [4].map(mapBtn) : pn === 5 ? null : '...'
                }
                {
                    pn > 4 && pn < pageCount-3 ? [pn-1, pn, pn+1].map(mapBtn) : null
                }
                {
                    pn === pageCount - 3 ? [pageCount-3].map(mapBtn) : pn === pageCount - 4 ? null : '...'
                }
                {
                    [pageCount-2, pageCount-1, pageCount].map(mapBtn)
                }
                <a onClick={this.clickBtn.bind(this, pn < pageCount ? pn + 1 : pageCount)}>下一页</a>
            </div>
        )
    }

    clickBtn(i){
        if(i === this.state.pn) return;

        this.setState({
            pn: i
        });

        this.props.onChange && this.props.onChange(i);
    }

    initState(_props){
        const {pageNO, pageSize, totalCount} = _props || this.props;

        this.setState({
            pn: pageNO,
            pageCount: totalCount % pageSize ? ~~(totalCount / pageSize) + 1 : totalCount / pageSize,
        });
    }
}

Pagination.propTypes = {
    pageNO: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
}

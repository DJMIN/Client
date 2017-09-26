const React = require('react');
const { connect } = require('react-redux')
const { showModal } = require('../../../redux/actions/ui');
const { setEditedTemplate, findTemplate } = require('../../../redux/actions/actor');
const TemplateEdit = require('./TemplateEdit');
const TemplateItem = require('../../../components/TemplateItem');
const ReactTooltip = require('react-tooltip');

require('./ActorCreate.scss');

class ActorCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: ''
    };
  }

  _handleSearch() {
    // console.log(this.state.searchName);
    let searchName = this.state.searchName;
    this.props.findTemplate(searchName);
  }

  _handleCreateTemplate() {
    this.props.setEditedTemplate({});
    this.props.showModal(<TemplateEdit />);
  }

  _handleEdit(item) {
    this.props.setEditedTemplate(item.toJS());
    this.props.showModal(<TemplateEdit />);
  }

  getFindResult() {
    let findingResult = this.props.findingResult;
    if(findingResult) {
      if(findingResult.length === 0) {
        return (
          <div className="no-result">暂无搜索结果...</div>
        )
      }else {
        return findingResult.map((item, index) => {
          return (
            <TemplateItem
              key={"template-find-result" + item.get('uuid')}
              canEdit={false}
              name={item.get('name')}
              desc={item.get('desc')}
              creator={''}
              time={item.get('updateAt')}
              onEdit={() => this._handleEdit(item)}
            />
          )
        })
      }
    }else {
      return null;
    }
  }

  render()　{
    return (
      <div className="actor-create">
        <ReactTooltip effect="solid" />
        <div className="header">
          <input
            type="text"
            placeholder="输入要搜索的模板名"
            value={this.state.searchName}
            onChange={(e) => {
              this.setState({searchName: e.target.value})
            }}
          />
        <button onClick={() => this._handleSearch()}>
            <i className="iconfont">&#xe60a;</i>搜索
          </button>
          <button onClick={() => this._handleCreateTemplate()}>
            <i className="iconfont">&#xe604;</i>创建新的人物模板
          </button>
        </div>
        <div className="body">
          <div className="search-result">
            { this.getFindResult() }
          </div>
          <div className="self-template">
            {
              this.props.selfTemplate.map((item, index) => {
                return (
                  <TemplateItem
                    key={item.get('uuid')}
                    canEdit={true}
                    name={item.get('name')}
                    desc={item.get('desc')}
                    creator={this.props.username}
                    time={item.get('updateAt')}
                    onEdit={() => this._handleEdit(item)}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    username: state.getIn(['user', 'info', 'username']),
    findingResult: state.getIn(['actor', 'findingResult']),
    selfTemplate: state.getIn(['actor', 'selfTemplate']),
  }),
  dispatch => ({
    showModal: (body) => dispatch(showModal(body)),
    setEditedTemplate: (obj) => dispatch(setEditedTemplate(obj)),
    findTemplate: (name) => dispatch(findTemplate(name)),
  })
)(ActorCreate)

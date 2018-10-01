var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _React = React,
    Component = _React.Component;

// parent Component

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      data: [],
      last30DaysBtnDisabled: true,
      allTimeBtnDisabled: false
    };

    // function call to set initial state
    _this.getLast30Days();
    return _this;
  }

  // ajax call function


  _createClass(App, [{
    key: 'getLast30Days',
    value: function getLast30Days() {
      var _this2 = this;

      fetch('https://fcctop100.herokuapp.com/api/fccusers/top/recent').then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.setState({ data: data });
      }).catch(function () {
        _this2.setState({ data: [] });
      });
      this.setState({
        last30DaysBtnDisabled: true,
        allTimeBtnDisabled: false
      });
    }

    // ajax call function

  }, {
    key: 'getAllTime',
    value: function getAllTime() {
      var _this3 = this;

      fetch('https://fcctop100.herokuapp.com/api/fccusers/top/alltime').then(function (response) {
        return response.json();
      }).then(function (data) {
        _this3.setState({ data: data });
      }).catch(function () {
        _this3.setState({ data: [] });
      });
      this.setState({
        allTimeBtnDisabled: true,
        last30DaysBtnDisabled: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      // render Leaderboard
      return React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'h1',
          null,
          'Free Code Camp Leaderboard'
        ),
        React.createElement(
          'button',
          { type: 'button', className: 'btn btn-primary last30Days',
            disabled: this.state.last30DaysBtnDisabled,
            onClick: function onClick() {
              return _this4.getLast30Days();
            } },
          'Top 100 Last 30 Days'
        ),
        React.createElement(
          'button',
          { type: 'button', className: 'btn btn-primary allTime',
            disabled: this.state.allTimeBtnDisabled,
            onClick: function onClick() {
              return _this4.getAllTime();
            } },
          'Top 100 All Time'
        ),
        React.createElement(Leaderboard, { data: this.state.data })
      );
    }
  }]);

  return App;
}(Component);

// child Component of App


var Leaderboard = function Leaderboard(props) {

  var tableRecords = props.data.map(function (record, index) {
    // create an array of TableRecord components from the JSON data
    return React.createElement(TableRecord, {
      rank: index + 1,
      key: record.username,
      username: record.username,
      imageURL: record.img,
      recent: record.recent,
      allTime: record.alltime });
  });

  // create the Leaderboard out of the array of TableRecord components
  return React.createElement(
    'div',
    { className: 'leaderboard' },
    React.createElement(
      'table',
      { className: 'table table-striped table-bordered table-hover table-sm' },
      React.createElement(
        'thead',
        { className: 'thead-inverse' },
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Rank'
          ),
          React.createElement(
            'th',
            null,
            'Username'
          ),
          React.createElement(
            'th',
            null,
            'Avatar'
          ),
          React.createElement(
            'th',
            null,
            'Points from Last 30 Days'
          ),
          React.createElement(
            'th',
            null,
            'All Time Points'
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        tableRecords
      )
    )
  );
};

// child component of leaderboard
var TableRecord = function TableRecord(props) {

  return React.createElement(
    'tr',
    null,
    React.createElement(
      'td',
      null,
      props.rank
    ),
    React.createElement(
      'td',
      null,
      props.username
    ),
    React.createElement(
      'td',
      null,
      React.createElement('img', { src: props.imageURL })
    ),
    React.createElement(
      'td',
      null,
      props.recent
    ),
    React.createElement(
      'td',
      null,
      props.allTime
    )
  );
};

ReactDOM.render(React.createElement(App, null), document.querySelector('.app'));
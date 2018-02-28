var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _React = React,
    Component = _React.Component;

var Marked = marked;

var getExampleText = function getExampleText() {
  // examples provided by Wikipedia (https://en.wikipedia.org/wiki/Markdown)
  var exampleText = "# Heading\n## Sub-heading\n### Another deeper heading\n\nParagraphs are separated\nby a blank line.\n\nTwo spaces at the end of a line leave a  \nline break.\n\nText attributes _italic_, *italic*,\n__bold__, **bold**," + ' `monospace`.' + "\n\nHorizontal rule:\n\n---\n\nBullet list:\n* apples\n* oranges\n* pears\n\nNumbered list:\n1. apples\n2. oranges\n3. pears\n\nA [link](http://example.com).";

  return exampleText;
};

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      convertedMarkdown: Marked(getExampleText(), { santize: true })
    };
    return _this;
  }

  _createClass(App, [{
    key: "convertMarkdown",
    value: function convertMarkdown(inputText) {
      var convertedMarkdown = Marked(inputText, { santize: true });

      this.setState({ convertedMarkdown: convertedMarkdown });
    }
  }, {
    key: "render",
    value: function render() {
      var convertMarkdown = this.convertMarkdown.bind(this);

      return React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "heading" },
          React.createElement(
            "h1",
            null,
            "Markdown Previewer"
          ),
          React.createElement(
            "p",
            null,
            "Type some Markdown into the box below, and see it converted to HTML on the opposite side!"
          ),
          React.createElement(
            "p",
            null,
            "Want to learn more about Markdown? ",
            React.createElement(
              "a",
              { href: "https://en.wikipedia.org/wiki/Markdown" },
              "Click here for the Wikipedia article"
            ),
            ". Example text provided by Wikipedia."
          )
        ),
        React.createElement(MarkdownField, { onUserInput: convertMarkdown, exampleText: getExampleText() }),
        React.createElement(HTMLPreview, { textDisplay: this.state.convertedMarkdown })
      );
    }
  }]);

  return App;
}(Component);

var MarkdownField = function (_Component2) {
  _inherits(MarkdownField, _Component2);

  function MarkdownField(props) {
    _classCallCheck(this, MarkdownField);

    var _this2 = _possibleConstructorReturn(this, (MarkdownField.__proto__ || Object.getPrototypeOf(MarkdownField)).call(this, props));

    _this2.state = {
      inputText: props.exampleText
    };
    return _this2;
  }

  _createClass(MarkdownField, [{
    key: "onInputChange",
    value: function onInputChange(inputText) {
      this.setState({ inputText: inputText });
      this.props.onUserInput(inputText);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return React.createElement(
        "div",
        { className: "markdown-field col-md-6" },
        React.createElement("textarea", {
          cols: "60",
          rows: "20",
          value: this.state.inputText,
          onChange: function onChange(event) {
            return _this3.onInputChange(event.target.value);
          } })
      );
    }
  }]);

  return MarkdownField;
}(Component);

var HTMLPreview = function HTMLPreview(props) {

  var addPreview = function addPreview() {
    return { __html: props.textDisplay };
  };

  return React.createElement("div", { className: "html-field col-md-6", dangerouslySetInnerHTML: addPreview() });
};

ReactDOM.render(React.createElement(App, null), document.querySelector('.app'));

import React, { Component, render } from 'react'
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

export class MyCustomReactComponent extends React.Component {

  static propTypes = {
    text: PropTypes.string,
    onHelloEvt: PropTypes.func
  }

  static defaultProps = {
    text: "React text"
  }

  render() {
    const { text, onHelloEvt } = this.props;
    return (
      <div className="MyCustomReactComponent">
        <p>Text <strong>{text}</strong> from your friendly React component.</p>
        <button type="submit" className="btn btn-secondary" onClick={onHelloEvt}>Send text</button>
      </div>
    )
  }

}

export default MyCustomReactComponent;
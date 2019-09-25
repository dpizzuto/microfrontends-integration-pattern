
import React, { Component, render } from 'react'
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

export class MyCustomReactComponent extends React.Component {

  static propTypes = {
    name: PropTypes.string,
    onHelloEvt: PropTypes.func
  }

  static defaultProps = {
    name: "Dario"
  }

  render() {
    const { name, onHelloEvt } = this.props;
    return (
      <div className="MyCustomReactComponent">
        <p>Hello <strong>{name}</strong> from your friendly React component.</p>
        <button type="submit" className="btn btn-secondary" onClick={onHelloEvt}>Say hello</button>
      </div>
    )
  }

}

export default MyCustomReactComponent;
import * as React from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById('modal-root');

export class Portal extends React.Component {
    private el: HTMLDivElement;
    constructor(props: { children?: React.ReactNode }) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        modalRoot?.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot?.removeChild(this.el);
    }
  
    render() {
        return ReactDOM.createPortal(
        this.props.children,
        this.el,
        );
    }
}
import React, { useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Alert } from '@material-ui/lab';
let wrap

export const message = {
    error: (content) => {
        alert(content, 'error')
    },
    warn: (content) => {
        alert(content, 'warning')
    },
    info: (content) => {
        alert(content, 'info')
    },
    success: (content) => {
        alert(content, 'success')
    }
}

export const alert = (content, type = 'info') => {
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.style.cssText = `
        line-height:1.5;
        text-align:center;
        color: #333;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		list-style: none;
		position: fixed;
		z-index: 100000;
		width: 100%;
		top: 16px;
		left: 0;
		pointer-events: none;`;
    }
    if (wrap) {
        document.body && document.body.appendChild(wrap); //挂body上
    }
    const divs = document.createElement("div");
    wrap.appendChild(divs);
    ReactDOM.render(
        <Message rootDom={wrap} parentDom={divs} content={content} type={type} />,
        divs
    );
}

export function Message(props) {
    const { parentDom, rootDom, content, type } = props
    const unmount = useMemo(() => {
        return () => {
            if (parentDom && rootDom) {
                ReactDOM.unmountComponentAtNode(parentDom);
                rootDom.removeChild(parentDom);
            }
        };
    }, [parentDom, rootDom]);

    useEffect(() => {
        setTimeout(() => {
            unmount();
        }, 2000);
    }, [unmount]);

    return <Alert severity={type}>{content}</Alert>
}

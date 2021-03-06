import React from 'react';

export default function ListItem(props) {
    return (
        <li className="list-group-item">
            {props.children}
        </li>
    );
}
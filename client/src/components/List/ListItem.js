import React from 'react';

export default function ListItem(props) {
    return (
        <li class="list-group-item">
            {props.children}
        </li>
    );
}
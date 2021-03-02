import React from 'react';

export default function List(props) {
    return (
        <ul class="list-group">
            {props.children}
        </ul>
    )
}
import React from 'react';


export const  List = ({ component: Component, ...rest }) => {
    const users = rest.users
    return (
        <ol style={rest.containerStyle}>
            {users.map(user => <Component
               user    = {user}
               liStyle = {rest.itemStyle}
               style2  = {rest.style2}
             />)}

        </ol>
    )
}

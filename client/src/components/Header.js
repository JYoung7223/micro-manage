import React, { useReducer } from "react";

function Header(){
    const initHeader = {
        heading: "Universal Process Management",
        subHeading: "Manage Millions on a Personal Level",
        logo: "./logo.png",
        logoAlt: "Logo",
        logoLink: "/"
    };

    function changeHeader(currentHeader, change){
        return {...currentHeader, change};
    }

    const [headerData, setHeaderData] = useReducer(changeHeader, initHeader);

    return (
        <header className="container-fluid">
            <div className="row">
                <div className="col logo ml-0">
                    <a href={headerData.logoLink}>
                        <img src={headerData.logo} alt={headerData.logoAlt}/>
                        <span className="company-name text-company-primary text-wrap align-left">{headerData.name}</span>
                    </a>
                </div>
                <div className="col my-auto mr-0">
                    <span className="text-company-secondary align-right">{headerData.subHeading}</span>
                </div>
            </div>
        </header>
    );
}

export {
    Header
};
import React from 'react'

export default function Nav() {
  return (
    <>
        <div className="container-fluid bg-dark text-white p-3">
             <div className="container">
                <ul className="nav">
                    <li className="nav-item">
                       <a className="nav-link" href="/">Link</a>
                    </li>
                    <li className="nav-item">
                       <a className="nav-link" href="/">Sign up</a>
                    </li>
                    <li className="nav-item">
                       <a className="nav-link" href="/">Login</a>
                    </li>
                    <li className="nav-item">
                       <a className="nav-link disabled" href="/">Disabled</a>
                    </li>
                </ul>
            </div>
        </div>
    </>

    )
}

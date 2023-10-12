import React from 'react'

export default function Form() {
  return (
    <>
       <div className="container-fluid p-5">
            <div className="container">
                <form action="/action_page.php" className='p-5'>
                    <div class="form-group">
                       <label for="email">Email address:</label>
                       <input type="email" class="form-control" placeholder="Enter email" id="email"/>
                    </div>
                    <div class="form-group">
                       <label for="pwd">Password:</label>
                       <input type="password" class="form-control" placeholder="Enter password" id="pwd"/>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </>
    )
}

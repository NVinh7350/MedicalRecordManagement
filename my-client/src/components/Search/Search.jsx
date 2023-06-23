import React from 'react'
import {BsSearch} from 'react-icons/bs'
import './Search.css'
const Search = ({planceHolder, onClick, setSearchContent}) => {
  return (
    <div className='search-container'>
            <input type='text' onChange={(e) => setSearchContent(e.target.value)} placeholder={planceHolder}></input>
            <button onClick={onClick}>
                <i>
                    <BsSearch></BsSearch>
                </i>
            </button>
    </div>
  )
}

export default Search
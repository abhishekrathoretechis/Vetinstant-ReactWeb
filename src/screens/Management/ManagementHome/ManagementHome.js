import React from 'react'
import Header from '../../../layouts/header'
import TopBar from '../../../components/TopBar/TopBar'
import SearchRow from '../../../components/SearchRow/SearchRow'

const ManagementHome = () => {
  return (
    <>
     <Header name="Vetinstant" />
      <TopBar
        name="Home"
        leftBtnTxt="Download"
        rightBtnTxt="Create Pet"
        rightVerBtnShow={false}
      />
      <SearchRow leftBtnTxt="Reset" rightBtnTxt="Search" />
</>
  )
}

export default ManagementHome;
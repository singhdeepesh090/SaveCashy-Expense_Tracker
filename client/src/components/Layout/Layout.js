import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col h-[100vh]'>
        <Header />
        <div className='h-[80%]'>
            {children}
        </div>
        <Footer />
    </div>
  )
}

export default Layout
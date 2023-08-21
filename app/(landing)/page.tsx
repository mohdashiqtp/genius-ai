import React from 'react'
import Link from 'next/link'

function LandingPage() {
  return (
    <div>

        LandingPage
        <div>
            <Link href='/sign-in'>
                <button>
                    Log in
                </button>
            </Link>
        </div>
        <div>
        <Link href='/sign-up'>
            <button>
                Register
            </button>
        </Link>
    </div>


    </div>
  )
}

export default LandingPage
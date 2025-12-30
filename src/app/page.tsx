// 'use client'

// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import { login } from '@/lib/api' // adjust path if needed

// interface LoginResponse {
//   access_token: string
// }

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert('Enter credentials!')
//       return
//     }

//     try {
//       setLoading(true)
//       const data: LoginResponse = await login(email, password)
//       localStorage.setItem('token', data.access_token)
//       router.push('/dashboard')
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         alert(err.message)
//       } else {
//         alert('Login failed')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold mb-6 text-black">Admin Login</h2>

        
//         <input
//           suppressHydrationWarning
//           className="border p-2 w-full mb-4 text-black"
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           suppressHydrationWarning
//           className="border p-2 w-full mb-4 text-black"
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           suppressHydrationWarning
//           onClick={handleLogin}
//           disabled={loading}
//           className="bg-blue-600 text-white py-2 px-4 rounded w-full"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </div>
//     </div>
//   )
// }


'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { login } from '@/lib/api'

interface LoginResponse {
  access_token: string
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Fix SSR issue - only access localStorage after component mounts
  useEffect(() => {
    setMounted(true)
    
    // Check if already logged in
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        router.push('/dashboard')
      }
    }
  }, [router])

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const data: LoginResponse = await login(email, password)
      
      // Only access localStorage in the browser
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.access_token)
      }
      console.log('Token stored in localStorage')
      router.push('/dashboard')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-black">Admin Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          className="border p-2 w-full mb-4 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <input
          className="border p-2 w-full mb-4 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  )
}
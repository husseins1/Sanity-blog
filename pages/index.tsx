import Head from 'next/head'
import Link from 'next/link';
import Header from '../components/Header'
import {sanityClient,urlFor} from "../sanity"
import { Post } from '../typings'
interface Props{
  posts:[Post]
}

export default function Home({posts}:Props) {
  console.log(posts);
  
  return (
    <div className="max-w-7xl mx-auto ">
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <div className='flex px-10  bg-yellow-400 items-center justify-between border-y-2 p-5 lg:p-10  border-black '>
        
        <div className='mt-12  space-y-5'>
          <h1 className='text-6xl  max-w-xl font-serif '>
            <span className='underline decoration-black decoration-4'>Fox</span>{" "}
               is the way to connect, write, and read.
          </h1>
          <h2 className="text-3xl">
            It is easy to share your thinking and ideas here.
          </h2>
        </div>
        <img src="/logo.png" alt="logo" className='hidden h-32 md:inline-flex lg:h-full rounded-full' />
      </div>
      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map(post=>(
          <Link href={`post/${post.slug.current}`} key={post._id}>
            <div className="group cursor-pointer border-2  overflow-hidden rounded-lg">
              <img className='w-full object-cover h-60 group-hover:scale-105 transition-transform duration-200 ease-out' src={urlFor(post.mainImage).url()!} alt="" />
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className='text-xl font-bold'>{post.title}</p>
                  <p className="text-xs">{post.description}by {post.author.name}</p>
                  
                </div>
                <img src={urlFor(post.author.image).url()!} className='h-12 w-12 rounded-full object-cover' alt="" />
              </div>
            </div>

          </Link>
        ))}
      </div>
      
    </div>
  )
}

export const getServerSideProps = async()=> {
  const query = `*[_type=="post"]{
  _id,
  title,
  author->{
  name,
  image
    },
  description,
  slug,
  mainImage

}`
const posts = await sanityClient.fetch(query);
   return {
     props:{
       posts,
     }
   }
}

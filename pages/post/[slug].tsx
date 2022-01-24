import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import {useForm,SubmitHandler} from "react-hook-form";
import {useState} from "react"
interface Props {
  post: Post;
}
interface IForm{
  _id:string;
  name:string;
  email:string;
  comment:string;
}

export default function PostPage({ post }: Props) {
  const [submit,setSubmitted] = useState(false)
  const {register,handleSubmit,formState:{errors}} = useForm<IForm>()
  console.log(post);
  
  const submitForm: SubmitHandler<IForm> = async(data)=>{
    try {
      const response = await fetch("/api/createComment",{
        method:"POST",
        body:JSON.stringify(data),
      })
      console.log(response);
      setSubmitted(true)
      
    } catch (error) {
      console.log(error);
      
    }
    
    
  }

  return (
    <main>
      <Header />
      <img
        src={urlFor(post.mainImage).url()!}
        alt=""
        className="w-full h-40 object-cover"
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            alt=""
            className="h-10 w-10 rounded-full"
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span>-Published
            at {new Date(post._createAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props}></h1>
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props}></h2>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:undeline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
        <div className="shadow ">
          <h1 className="text-xl font-bold mb-8 inline-block border-yellow-500 border-b-2">Comments section</h1>
          <div className="space-y-4">
            {post.comments.map((ele,i)=>(<div  key={i} className="bg-gray-300 bg-opacity-30 p-4">
              <h1 className="font-bold"> {ele.name} of {" "} <span className="text-gray-400">{ele.email} at {new Date(ele._createdAt).toLocaleString()}</span></h1>
              <p className="ml-2 mt-2">{ele.comment}</p>
            </div>))}
          </div>

        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
      {submit?
      (<div className="text-3xl mx-auto max-w-3xl mb-8 text-white bg-yellow-500 p-4">Thank you for your comment</div>)
        : <form onSubmit={handleSubmit(submitForm)} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
          <h3 className="text-sm text-yellow-500">Enjoy this article</h3>
          <h4 className="text-3xl font-bold">Leave a comment below</h4>
          <hr className="py-3 mt-2" />

          <label htmlFor="" className="block mb-5">
            <input type="hidden" value={post._id} {...register("_id", { required: true })} />
            <span className="text-grey-700">Name</span>
            <input
              {...register("name", { required: true })}
              placeholder="John Doe"
              type="text"
              className={"shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500"}
            />
          </label>
          <label htmlFor="" className="block mb-5">
            <span className="text-grey-700">Email</span>
            <input
              {...register("email", { required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ })}
              placeholder="JohnDoe@example.com"
              type="text"
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500"
            />
          </label>
          <label htmlFor="" className="block mb-5">
            <span className="text-grey-700">Comment</span>
            <textarea

              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea  mt-1 block w-full ring-yellow-500"
              rows={8}
            />
          </label>
          <div className="my-4">
            {errors.name && <p className="text-[#ff0000]"> Name is required</p>}
            {errors.email && <p className="text-[#f00]">Email is required</p>}
            {errors.comment && <p className="text-[#f00]">Comment is required</p>}
          </div>
          <button className="text-2xl font-bold bg-yellow-500 text-white py-3 hover:scale-105 transition-transform duration-200 ease-out" type="submit">Comment</button>
        </form>
      }
      
    </main>
  );
}

export const getStaticPaths = async () => {
  const query = `*[_type=="post"]{
  _id,
  slug,
}`;
  const posts = await sanityClient.fetch(query);
  const paths: [object] = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type=="post" && slug.current ==$slug ][0]{
  _id,
  title,
  author->{
  name,
  image
    },
  description,
  slug,
  'comments':*[
      _type == "comment" &&
      post._ref ==^._id &&
      approved == true
  ],
  mainImage,
  body}
    `;
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
  };
};

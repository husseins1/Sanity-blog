// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {createClient} from "next-sanity"

 const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2021-08-11", 
  token:process.env.SANITY_API_TOKEN,
  // or today's date for latest
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
  useCdn: process.env.NODE_ENV === "production",
};
 const sanityClient = createClient(config);


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {_id,name,email,comment} =JSON.parse(req.body)

    try {

        await sanityClient.create({
            _type:"comment",
            post:{
                _type:"reference",
                _ref:_id,

            },
            name,
            email,
            comment,
        });
    } catch (error) {
        return res.status(500).json({message:"Couldn't submit the comment"})
    }
    console.log("ok");
    
  res.status(200).json({ message: 'Comment submitted' })
}

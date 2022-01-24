export interface Post{
    _id:string;
    _createAt:string;
  title:string;
  author:{
  name:string;
  image:string
    };
  description:string;
  slug:{
      current:string;
  };
  mainImage:{
      asset:{
          url:string
      }
  };
  body:[object];
  comments:[Comments]

}
interface Comments {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: Post;
}


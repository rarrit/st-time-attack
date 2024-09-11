import axios from 'axios'
import './App.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

function App() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [views, setViews] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");

  // 게시물 정보
  const handleGetPost = async () => {
    const response = await axios.get("http://localhost:4000/posts");
    return response.data;
  }

  // 프로필 정보
  const handleGetProfile = async () => {
    const response = await axios.get("http://localhost:4000/profile");
    return response.data;
  }

  // 댓글 정보
  const handleGetComment = async () => {
    const response = await axios.get("http://localhost:4000/comments");
    return response.data;
  }


  // 게시물 쿼리
  const { data: postData , isLoading: isPostLoading, isError: isPostError } = useQuery({
    queryKey: ['posts'],
    queryFn: handleGetPost
  })

  // 프로필 쿼리
  const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useQuery({
    queryKey: ['profile'],
    queryFn: handleGetProfile
  })

  // 댓글 쿼리
  const { data: commentData, isLoading: isCommentLoading, isError: isCommentError, refetch } = useQuery({
    queryKey: ['comments'],
    queryFn: handleGetComment,
    enabled: true,
  }) 

  // 게시물 추가 함수
  const handleAddPost = async (e) => {
    e.preventDefault();
    const newData = { title, views }
    await axios.post("http://localhost:4000/posts", newData);
    alert("게시물이 등록되었습니다.");
  }


  console.log(commentData)

  // 댓글 보기 함수
  // 1. 댓글 id === postid 
  // 2. 클릭할 때 보여지려면 refetch
  const handleViewComment = (postId) => {
    const filterData = commentData.filter(comment => comment.postId === postId);
    setCommentList(filterData);
    console.log(commentList)        
  }
  
  
  
  


  // 게시물 추가
  const postMutation = useMutation({
    mutationKey: ['posts'],
    mutationFn: handleAddPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    }
  })

  // 댓글 추가
  const commentMutation = useMutation({
    mutationKey: ['comments'],
    mutationFn: (newData) => {
      return axios.post("http://localhost:4000/comments", newData);
    },    
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    }
  })
  

  if(isPostLoading) return <div>게시물 로딩중입니다..</div>
  if(isPostError) return <div>게시물 오류가 발생하였습니다..</div>
  if(isProfileLoading) return <div>게시물 프로필 로딩중입니다..</div>
  if(isProfileError) return <div>게시물 프로필 오류가 발생하였습니다..</div>
  // if(isCommentLoading) return <div>댓글 로딩중입니다..</div>
  // if(isCommentError) return <div>댓글 오류가 발생하였습니다..</div>


  // console.log("postData ==>", postData, "commentData ==>", commentData);
  // console.log(commentData);

  return (
    <>
      <form onSubmit={postMutation.mutate}>
        title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        views: <input type="text" value={views} onChange={(e) => setViews(e.target.value)}/>
        <button>저장</button>
      </form>
      
      {
        postData.map((post) => {
          return (
            <div key={post.id}>
              <hr/>
              <h2>{post.title}</h2><em>{post.views}</em><br/>
              <button onClick={() => handleViewComment(post.id)}>댓글보기</button>                
                {/**/}
                {post.id}

            

                <br/>
                댓글: <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}/>
                <button type='button' onClick={() => commentMutation.mutate({
                  comment,
                  postId: post.id
                })}>입력</button>
                <hr/>
            </div>
          )
        })
      }
    </>
  )
}

// 댓글 보기를 클릭할 때 해당 게시글에 맞는 댓글을 보여주면됌

export default App

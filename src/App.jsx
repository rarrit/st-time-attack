import axios from 'axios'
import './App.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

function App() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [views, setViews] = useState(0);

  const handleGetPost = async () => {
    const response = await axios.get("http://localhost:4000/posts");
    return response.data;
  }

  const handleAddPost = async (e) => {
    e.preventDefault();
    const newData = { title, views }
    await axios.post("http://localhost:4000/posts", newData);
    alert("게시물이 등록되었습니다.");
  }

  const mutation = useMutation({
    mutationKey: ['posts'],
    mutationFn: handleAddPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    }
  })

  const { data , isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: handleGetPost
  })

  if(isLoading) return <div>로딩중입니다..</div>
  if(isError) return <div>오류가 발생하였습니다..</div>

  console.log(data);
  return (
    <>
      <form onSubmit={mutation.mutate}>
        title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        views: <input type="text" value={views} onChange={(e) => setViews(e.target.value)}/>
        <button>저장</button>
      </form>
      
      {
        data.map(post => {
          return (
            <div key={post.id}>{post.title}{post.views}</div>
          )
        })
      }
    </>
  )
}

export default App

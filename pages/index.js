import { PrismaClient } from '@prisma/client'
import { FormProvider, useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns'

import styles from '../styles/Home.module.css'


export async function getStaticProps() {
  const db = new PrismaClient();    
  const messages = await db.message.findMany({
    include: {
      user: true
    }
  });

  return {
    props: { messages }
  }
}


export default function Home({ messages}) {
  return (
    <div className={`${styles.container} flex-1 flex-row`}>
      <div className="rounded-md bg-blue-500 shadow-md my-5 p-5 text-white">
        Welcome to the Message board!
      </div>

      <div>
        <MessageBoardForm />
      </div>
      <div>
        <MessageBoard messages={messages} />
      <ToastContainer />
      </div>
    </div>
  )
}


function MessageBoardForm(){
  const formMethods = useForm({
    default: {
      name: "",
      message: ""
    }
  });

  const handleSubmit = formMethods.handleSubmit(async data => {
    await fetch("/api/messageBoard", {
      body: JSON.stringify(data),
      method: "POST"
    })
      .then(res => res.json())
      .then(result => {
        if(result.message)
          toast(result.message, {
            autoClose: 5000,
            position: "top-right",
            headers: {
              'Content-Type': 'application/json',
            },
          });
        window.location.reload();
      });
  })

  return <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit} className="flex-auto w-52 border rounded-md p-2">
        <div className="border-b border-black p-2 text-lg font-bold mb-2">
          Message Board
        </div>
        <label htmlFor="username" className='flex w-full flex-wrap mb-2'>
          Username
          <input type="text" className="h-10 border pl-2 rounded-md w-full mb-2"  {...formMethods.register("username", { required: "You need a username.", minLength: 2, maxLength: 16  })} />
          <sub className="text-red-500">{formMethods.formState.errors?.username?.message}</sub>
        </label>
        <label htmlFor="message" className="flex w-full flex-wrap mb-2">
          Message
          <input type="text" className="h-10 border pl-2 rounded-md w-100 mb-2" {...formMethods.register("message", { required: "You need to give a message.", min: 2, max: 128 })} />
          <sub className="text-red-500 mb-2">{formMethods.formState.errors?.message?.message}</sub>
        </label>
        <button type="reset" className='bg-white ease-linear duration-150 p-2 rounded-md px-4 items-center text-red-500 text-md shadow-md hover:bg-red-200 mr-2'>Reset</button>
        <button type="submit" className='bg-blue-500 py-2 px-4 ease-linear duration-150 rounded-md items-center text-white text-md shadow-md hover:bg-blue-600' >Submit</button>
    </form>
  </FormProvider>
}


function MessageBoard({ messages }){
  if (!messages.length)
    return <h1> There are no messages to show yet.</h1>

  return <ul className="flex space-x-2">
    {
      messages.map(i => {
        return <li key={i.id} className="bg-gray-50 shadow-md rounded-md border hover:bg-gray-200 ease-linear duration-150 border-gray-200 my-1 w-1/3 p-2">
          <div><b>Posted by: </b>{i.user.username}</div>
          <div><b>Message: </b>{i.message}</div>
          <div><b>Created on: </b>{format(new Date(i.created_on), "dd MMM, HH:mm")}</div>
        </li>
      })
    }
  </ul>
}
//heu ehy
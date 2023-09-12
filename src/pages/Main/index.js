import React, {useState,useCallback,useEffect,} from 'react';
import {FaGithub, FaPlus,FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import {Container,Form, SubmitButton, List, DeleteButton} from './styles'

import api from '../../Services/api'


export default function Main(){

  const [newRepo,setNewRepo] = useState('');
  const [repositorios,setRepositorios] = useState([]);
  const [loading,setLoading] = useState(false);
  const [alert,setAlert] = useState(null)

  //Buscar
useEffect(()=>{
  const repoStorage = localStorage.getItem('repos');
  if(repoStorage){
    setRepositorios(JSON.parse(repoStorage))
  }

},[]);


  //Salver alteraçoes
  useEffect(()=>{
    localStorage.setItem('repos', JSON.stringify(repositorios));
  },[repositorios]);




   const handleSubmit = useCallback((e)=>{
    e.preventDefault();
    
    async function submit(){
      setLoading(true)
      setAlert(null)

      try{

        if(newRepo === ''){
          throw new Error('voce precisa incicar um repositorio')
        }


        const response = await api.get(`repos/${newRepo}`);

        //nao duplicar repositorio
        const hasRepo = repositorios.find(repo=> repo.name === newRepo)

        if(hasRepo){
          throw new Error('Repositorio duplicado!!')
        }
        

        const data ={
          name:response.data.full_name,
      }




      setRepositorios([...repositorios, data]);
      setNewRepo('');
      
      }catch(error){
        setAlert(true)
        console.log(error)
      }finally{

        setLoading(false)
      }
  
      
    }
    submit();
   },[newRepo,repositorios]);

 

  function hangleinputChange(e){
     setNewRepo(e.target.value)
     setAlert(null)

  }

      //Deletando Repositorio!!
      
  const handleDelete= useCallback((repo)=>{

    const find =repositorios.filter(r => r.name !== repo)

    setRepositorios(find);
  },[repositorios])

  return(
      <Container>

      <h1>
        <FaGithub size={30} color="#00a1b3" />
        Meus Repositorios
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>

        <input 
        type="text" 
        placeholder="Adicionar"
        value={newRepo}
        onChange={hangleinputChange}
        />

        <SubmitButton Loading={loading ? 1 : 0}>
          {loading ? (

            <FaSpinner size={14} color="#00a1b3" />
          ):(
            <FaPlus size={14} color="#FFF" />
          )
          }

         

        </SubmitButton>
      </Form>
      
      <List>
          {repositorios.map(repo =>(
            <li key={repo.name}>

              <span>

                
                <DeleteButton onClick={()=>handleDelete(repo.name)}>
                  <FaTrash size={16} color=''/>
                </DeleteButton>
                {repo.name}
              </span>
              <Link to={`/repositorio/${encodeURIComponent(repo.name)}`} >
                <FaBars size={20}/>
              </Link>  
            </li>
          ))}
        
      </List>

     </Container>
  )
}